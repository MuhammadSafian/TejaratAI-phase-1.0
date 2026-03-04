from celery.schedules import crontab
from core.celery_app import celery_app
import core.tasks  # noqa: F401 - register tasks

celery_app.conf.beat_schedule = {
    # ── Daily Sales Analysis (2 AM UTC) ──────────────
    "daily-sales-analysis": {
        "task":     "core.tasks.run_daily_analysis",
        "schedule": crontab(hour=2, minute=0),
        "args":     ("ALL_SELLERS",),
    },
    # ── Inventory Reorder Check (Every 6 hours) ─────
    "inventory-reorder-check": {
        "task":     "core.tasks.check_reorder_points",
        "schedule": crontab(minute=0, hour="*/6"),
        "args":     ("ALL_SELLERS",),
    },
    # ── Monthly PDF Reports (1st of month, 8 AM) ────
    "monthly-pdf-reports": {
        "task":     "core.tasks.generate_monthly_reports",
        "schedule": crontab(hour=8, minute=0, day_of_month="1"),
        "args":     ("ALL_SELLERS",),
    },
    # ── Order Sync (Every 15 minutes) ────────────────
    "order-sync-shopify": {
        "task":     "core.tasks.sync_orders",
        "schedule": crontab(minute="*/15"),
        "args":     ("ALL_SELLERS", "shopify"),
    },
    "order-sync-daraz": {
        "task":     "core.tasks.sync_orders",
        "schedule": crontab(minute="*/15"),
        "args":     ("ALL_SELLERS", "daraz"),
    },
    "order-sync-woocommerce": {
        "task":     "core.tasks.sync_orders",
        "schedule": crontab(minute="*/15"),
        "args":     ("ALL_SELLERS", "woocommerce"),
    },
    # ── Shipment Tracking (Every 30 minutes) ─────────
    "shipment-tracking": {
        "task":     "core.tasks.track_shipments",
        "schedule": crontab(minute="*/30"),
        "args":     ("ALL_SELLERS",),
    },
    # ── Materialized View Refresh (Every hour) ───────
    "refresh-mat-views": {
        "task":     "core.tasks.refresh_materialized_views",
        "schedule": crontab(minute=0, hour="*"),
    },
    # ── Daraz Commission Rates Sync (Weekly Monday 5AM) ──
    "daraz-commission-sync": {
        "task":     "core.tasks.sync_daraz_commissions",
        "schedule": crontab(hour=5, minute=0, day_of_week=1),
    },
}
