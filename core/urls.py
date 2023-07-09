from rest_framework.routers import DefaultRouter
from django.urls import path, include, re_path
from .views import AssignmentViewSet, UserViewSet, GradedAssignmentAPIView, RegisterStudentAPIView, RegisterTeacherAPIView, ValidateTakenAssignment, GetUserByToken


urlpatterns = [
    path('graded-assignments/',GradedAssignmentAPIView.as_view()),
    path('register-student/',RegisterStudentAPIView.as_view()),
    path('register-teacher/',RegisterTeacherAPIView.as_view()),
    path('check-assignment/<int:id>/', ValidateTakenAssignment.as_view()),
    path('getuserbytoken/', GetUserByToken.as_view()),
]

router = DefaultRouter()
router.register('users',UserViewSet)
router.register('assignments',AssignmentViewSet)
viewset_urls = router.urls
urlpatterns += viewset_urls
