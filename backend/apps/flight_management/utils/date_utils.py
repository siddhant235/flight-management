from datetime import date

from dateutil.relativedelta import relativedelta
from django.utils.timezone import now


def get_next_month_start():
    today = now().date()  # Get current date
    first_day_next_month = today.replace(day=1) + relativedelta(months=1)
    return first_day_next_month


def get_next_billing_date(subscription_start_date: date) -> date:
    return subscription_start_date + relativedelta(months=1)
