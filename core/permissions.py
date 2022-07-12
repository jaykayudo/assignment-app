from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS

class IsStaffOrFuckOff(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated

        return request.user.is_teacher
class IsStudentOrFuckOff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_student