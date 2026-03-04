from core.celery_app import celery_app
import asyncio
import logging

logger = logging.getLogger(__name__)


@celery_app.task(name="core.tasks.run_daily_analysis")
def run_daily_analysis(seller_id: str):
    """Triggers LangGraph flow for daily analysis."""
    asyncio.run(_run_analysis(seller_id))
    return {"status": "completed", "seller_id": seller_id}

async def _run_analysis(seller_id: str):
    from core.langgraph.graph import build_graph
    from core import db
    from datetime import datetime

    # If ALL_SELLERS — query DB for all active sellers
    if seller_id == "ALL_SELLERS":
        rows = await db.fetch_all("SELECT id::text FROM sellers")
        seller_ids = [str(r["id"]) for r in rows]
    else:
        seller_ids = [seller_id]

    graph = build_graph()
    for sid in seller_ids:
        try:
            initial_state = {
                "trigger_type": "daily_analysis",
                "trigger_time": datetime.utcnow(),
                "seller_id": sid,
                "requires_human_approval": False,
                "messages": [],
            }
            result = await graph.ainvoke(initial_state)
            logger.info(f"[DailyAnalysis] Completed for seller {sid} — BHS: {result.get('business_health_score')}")
        except Exception as e:
            logger.error(f"[DailyAnalysis] Failed for {sid}: {e}")


@celery_app.task(name="core.tasks.check_reorder_points")
def check_reorder_points(seller_id: str):
    """Checks inventory levels and triggers reorder alerts."""
    asyncio.run(_check_reorder(seller_id))
    return {"status": "checked", "seller_id": seller_id}

async def _check_reorder(seller_id: str):
    from core import db
    from datetime import datetime, timedelta
    from integrations.whatsapp import WhatsAppBusinessAPI

    # Get all sellers if ALL
    if seller_id == "ALL_SELLERS":
        rows = await db.fetch_all("SELECT id::text FROM sellers")
        seller_ids = [str(r["id"]) for r in rows]
    else:
        seller_ids = [seller_id]

    wa = WhatsAppBusinessAPI()

    for sid in seller_ids:
        inventory = await db.fetch_all(
            "SELECT sku, product_name, quantity, lead_time_days, max_lead_time_days FROM inventory WHERE seller_id = $1",
            sid,
        )

        low_stock_items = []
        for item in inventory:
            sku = item["sku"]
            stock = item["quantity"]

            # Calculate average daily sales (30 days)
            sales_30 = await db.fetch_val(
                """SELECT COALESCE(SUM(oi.quantity), 0)
                   FROM order_items oi JOIN orders o ON oi.order_id = o.id
                   WHERE oi.sku = $1 AND o.seller_id = $2
                     AND o.created_at >= $3""",
                sku, sid, datetime.utcnow() - timedelta(days=30),
            )
            avg_daily = (sales_30 or 0) / 30

            # ROP = (avg_daily × lead_time) + safety_stock
            lead = item.get("lead_time_days") or 7
            max_lead = item.get("max_lead_time_days") or 10
            safety = avg_daily * (max_lead - lead)
            rop = (avg_daily * lead) + safety

            if stock <= rop and avg_daily > 0:
                days_left = round(stock / avg_daily, 1) if avg_daily > 0 else 999
                low_stock_items.append({
                    "name": item["product_name"],
                    "current_stock": stock,
                    "days_remaining": days_left,
                    "reorder_qty": max(int(avg_daily * (30 + lead)), 1),
                })

        # Send WhatsApp alert if low stock found
        if low_stock_items:
            seller = await db.fetch_one("SELECT phone FROM sellers WHERE id = $1", sid)
            if seller and seller.get("phone"):
                msg = "📦 *Stock Alert — Reorder Needed*\n\n"
                for item in low_stock_items[:5]:
                    msg += (
                        f"• *{item['name']}*\n"
                        f"  Stock: {item['current_stock']} units\n"
                        f"  {item['days_remaining']:.0f} din mein khatam\n\n"
                    )
                try:
                    await wa.send_text(seller["phone"], msg)
                except Exception as e:
                    logger.error(f"WhatsApp reorder alert failed: {e}")
            logger.info(f"[ReorderCheck] {len(low_stock_items)} low stock items for seller {sid}")


@celery_app.task(name="core.tasks.generate_monthly_reports")
def generate_monthly_reports(seller_id: str):
    """Generates monthly summary and sends via WhatsApp."""
    asyncio.run(_generate_report(seller_id))
    return {"status": "generated", "seller_id": seller_id}

async def _generate_report(seller_id: str):
    from core import db
    from datetime import datetime, timedelta
    from integrations.whatsapp import WhatsAppBusinessAPI

    if seller_id == "ALL_SELLERS":
        rows = await db.fetch_all("SELECT id::text FROM sellers")
        seller_ids = [str(r["id"]) for r in rows]
    else:
        seller_ids = [seller_id]

    wa = WhatsAppBusinessAPI()
    last_month_start = (datetime.utcnow().replace(day=1) - timedelta(days=1)).replace(day=1)
    last_month_end = datetime.utcnow().replace(day=1) - timedelta(seconds=1)

    for sid in seller_ids:
        try:
            # Revenue
            revenue = await db.fetch_val(
                """SELECT COALESCE(SUM(order_value), 0) FROM orders
                   WHERE seller_id = $1 AND created_at BETWEEN $2 AND $3""",
                sid, last_month_start, last_month_end,
            )
            # Order count
            order_count = await db.fetch_val(
                """SELECT COUNT(*) FROM orders
                   WHERE seller_id = $1 AND created_at BETWEEN $2 AND $3""",
                sid, last_month_start, last_month_end,
            )
            # RTO count
            rto_count = await db.fetch_val(
                """SELECT COUNT(*) FROM shipments
                   WHERE seller_id = $1 AND returned_at IS NOT NULL
                     AND created_at BETWEEN $2 AND $3""",
                sid, last_month_start, last_month_end,
            )
            # Delivered
            delivered = await db.fetch_val(
                """SELECT COUNT(*) FROM shipments
                   WHERE seller_id = $1 AND delivered_at IS NOT NULL
                     AND created_at BETWEEN $2 AND $3""",
                sid, last_month_start, last_month_end,
            )
            # AOV
            aov = float(revenue or 0) / max(int(order_count or 1), 1)
            rto_rate = round(int(rto_count or 0) / max(int(order_count or 1), 1) * 100, 1)

            month_name = last_month_start.strftime("%B %Y")
            msg = (
                f"📊 *Tejarat AI — Monthly Report*\n"
                f"*{month_name}*\n"
                f"{'─' * 25}\n\n"
                f"💰 Revenue: *Rs {float(revenue or 0):,.0f}*\n"
                f"📦 Orders: *{order_count}*\n"
                f"✅ Delivered: *{delivered}*\n"
                f"🔄 Returns: *{rto_count}* ({rto_rate}%)\n"
                f"📈 AOV: *Rs {aov:,.0f}*\n\n"
                f"Detail dashboard pe dekhein! 📱"
            )

            seller = await db.fetch_one("SELECT phone FROM sellers WHERE id = $1", sid)
            if seller and seller.get("phone"):
                await wa.send_text(seller["phone"], msg)
            logger.info(f"[MonthlyReport] Sent for {sid}: Rs {revenue}, {order_count} orders")
        except Exception as e:
            logger.error(f"[MonthlyReport] Failed for {sid}: {e}")


@celery_app.task(name="core.tasks.sync_orders")
def sync_orders(seller_id: str, platform: str):
    """Polls platform API for new orders and syncs to DB."""
    if platform == "daraz":
        asyncio.run(_poll_daraz(seller_id))
    elif platform == "shopify":
        asyncio.run(_poll_shopify(seller_id))
    elif platform == "woocommerce":
        asyncio.run(_poll_woocommerce(seller_id))
    return {"status": "synced", "platform": platform}

async def _poll_daraz(seller_id: str):
    from integrations.daraz import DarazClient
    from security.vault import get_decrypted_token
    try:
        creds = await get_decrypted_token(seller_id, "daraz")
        client = DarazClient(access_token=creds.get("access_token", ""))
        new_orders = await client.poll_new_orders(seller_id)
        if new_orders:
            logger.info(f"[DarazPoll] Found {len(new_orders)} new orders for {seller_id}")
    except Exception as e:
        logger.error(f"[DarazPoll] Error for {seller_id}: {e}")

async def _poll_shopify(seller_id: str):
    from integrations.shopify import ShopifyClient
    from security.vault import get_decrypted_token
    try:
        creds = await get_decrypted_token(seller_id, "shopify")
        client = ShopifyClient(shop_domain=creds.get("shop_domain", ""), access_token=creds.get("access_token", ""))
        new_orders = await client.poll_new_orders(seller_id)
        if new_orders:
            logger.info(f"[ShopifyPoll] Found {len(new_orders)} new orders for {seller_id}")
    except Exception as e:
        logger.error(f"[ShopifyPoll] Error for {seller_id}: {e}")

async def _poll_woocommerce(seller_id: str):
    from integrations.woocommerce import WooCommerceClient
    from security.vault import get_decrypted_token
    try:
        creds = await get_decrypted_token(seller_id, "woocommerce")
        client = WooCommerceClient(
            store_url=creds.get("store_url", ""),
            consumer_key=creds.get("consumer_key", ""),
            consumer_secret=creds.get("consumer_secret", ""),
        )
        new_orders = await client.poll_new_orders(seller_id)
        if new_orders:
            logger.info(f"[WooPoll] Found {len(new_orders)} new orders for {seller_id}")
    except Exception as e:
        logger.error(f"[WooPoll] Error for {seller_id}: {e}")


@celery_app.task(name="core.tasks.track_shipments")
def track_shipments(seller_id: str):
    """Updates shipment tracking status from courier APIs."""
    asyncio.run(_track_all_shipments(seller_id))
    return {"status": "tracked", "seller_id": seller_id}

async def _track_all_shipments(seller_id: str):
    from core import db
    from integrations.couriers.tcs import TCSClient
    from integrations.couriers.leopards import LeopardsClient
    from integrations.couriers.postex import PostExClient
    from integrations.couriers.trax import TraxClient
    from core.config import settings
    from integrations.whatsapp import WhatsAppBusinessAPI

    if seller_id == "ALL_SELLERS":
        rows = await db.fetch_all("SELECT id::text FROM sellers")
        seller_ids = [str(r["id"]) for r in rows]
    else:
        seller_ids = [seller_id]

    courier_clients = {
        "tcs": TCSClient(settings.TCS_API_KEY),
        "leopards": LeopardsClient(settings.LEOPARDS_API_KEY, settings.LEOPARDS_API_PASSWORD),
        "postex": PostExClient(settings.POSTEX_TOKEN),
        "trax": TraxClient(settings.TRAX_API_KEY, settings.TRAX_USERNAME),
    }
    wa = WhatsAppBusinessAPI()

    for sid in seller_ids:
        active_shipments = await db.fetch_all(
            """SELECT id, tracking_number, courier, status, order_id
               FROM shipments
               WHERE seller_id = $1 AND status NOT IN ('delivered', 'returned', 'cancelled')""",
            sid,
        )

        for shipment in active_shipments:
            courier_name = shipment["courier"]
            tracking = shipment["tracking_number"]
            old_status = shipment["status"]
            client = courier_clients.get(courier_name)
            if not client:
                continue

            try:
                result = await client.track(tracking)
                new_status = result.get("status", old_status)

                if new_status != old_status:
                    # Update DB
                    update_fields = "status = $1"
                    args = [new_status, tracking]

                    if new_status == "delivered":
                        update_fields += ", delivered_at = NOW()"
                    elif new_status in ("returned", "rto"):
                        update_fields += ", returned_at = NOW()"
                        # Log to RTO history
                        order = await db.fetch_one("SELECT customer_phone, customer_city FROM orders WHERE id = $1", shipment["order_id"])
                        if order:
                            await db.execute(
                                """INSERT INTO rto_history (phone_number, city, courier, order_returned, seller_id, created_at)
                                   VALUES ($1, $2, $3, TRUE, $4, NOW())""",
                                order["customer_phone"], order["customer_city"], courier_name, sid,
                            )

                    await db.execute(f"UPDATE shipments SET {update_fields} WHERE tracking_number = $2", *args)
                    logger.info(f"[ShipmentTrack] {tracking} ({courier_name}): {old_status} → {new_status}")

                    # Notify seller on delivery/return
                    if new_status in ("delivered", "returned"):
                        seller = await db.fetch_one("SELECT phone FROM sellers WHERE id = $1", sid)
                        if seller:
                            emoji = "✅" if new_status == "delivered" else "🔄"
                            await wa.send_text(seller["phone"], f"{emoji} Shipment {tracking} — *{new_status.upper()}*")
            except Exception as e:
                logger.error(f"[ShipmentTrack] Error tracking {tracking}: {e}")


@celery_app.task(name="core.tasks.refresh_materialized_views")
def refresh_materialized_views():
    """Refreshes PostgreSQL materialized views for analytics."""
    asyncio.run(_refresh_views())
    return {"status": "refreshed"}

async def _refresh_views():
    from core import db
    await db.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY city_courier_rto_rate")
    logger.info("[MatView] Refreshed city_courier_rto_rate")


@celery_app.task(name="core.tasks.sync_daraz_commissions")
def sync_daraz_commissions():
    """Weekly sync of Daraz category commission rates."""
    asyncio.run(_sync_commissions())
    return {"status": "synced"}

async def _sync_commissions():
    from integrations.daraz import DarazClient
    client = DarazClient()
    rates = await client.sync_commission_rates()
    logger.info(f"[CommissionSync] Synced {len(rates)} category rates")
