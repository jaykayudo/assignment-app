from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Assignment)
admin.site.register(GradedAssignment)
admin.site.register(Choice)
admin.site.register(Question)
admin.site.register(Teacher)
admin.site.register(Student)
