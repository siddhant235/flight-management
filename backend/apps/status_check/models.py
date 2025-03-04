from django.db import models


class StatusCheckLog(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "status_check_log"
