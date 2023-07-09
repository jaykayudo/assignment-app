from pickletools import read_uint1
from re import I
from urllib import request
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsStaffOrFuckOff, IsStudentOrFuckOff
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from core.serializers import AssignmentSerializer, GradedAssignmentSerializer, UserSerializer, StudentSerializer, TeacherSerializer
from .models import Assignment, GradedAssignment, Student, User
# Create your views here.

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AssignmentViewSet(ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated, IsStaffOrFuckOff]

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            assignment = serializer.create_class(request)
            if assignment:
                return Response(status = status.HTTP_201_CREATED)
        else:

            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class GradedAssignmentAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsStudentOrFuckOff]
    serializer_class = GradedAssignmentSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(instance=queryset, many = True)
        return Response(serializer.data,status.HTTP_200_OK)
    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            gradedAss = serializer.create_obj(request)
            if gradedAss:
                return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        student = Student.objects.get(user = self.request.user)
        gradedAnts = GradedAssignment.objects.filter(student = student)
        return gradedAnts

class RegisterTeacherAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = TeacherSerializer(data = data)
        if serializer.is_valid():
            teacher = serializer.create_obj(request)
            if teacher:
                return Response(status = status.HTTP_201_CREATED)
            else:
                return Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(data = serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class RegisterStudentAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = StudentSerializer(data = data)
        if serializer.is_valid():
            student = serializer.create_obj(request)
            if student:
                return Response(status = status.HTTP_201_CREATED)
            else:
                return Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(data = serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class ValidateTakenAssignment(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,*args,**kwargs):
        data = get_object_or_404(Assignment, id = int(kwargs['id']))
        student = Student.objects.get(user = request.user)
        queryset = GradedAssignment.objects.filter(student = student).values('assignment')
        for x in queryset:
            if data.id == x['assignment']:
                return JsonResponse({"taken":True})
        return JsonResponse({"taken":False})

class GetUserByToken(APIView):
    def post(self,request,*args,**kwargs):
        # token = data['token'][5:]
        # print(token)
        # print(Token.objects.all().values('key'))
        # print(Token.objects.filter(key = token).exists())
        # try:
        #     user = Token.objects.get(key = token).user
        # except Exception as err:
        #     print(err)
        #     return Response(status=status.HTTP_400_BAD_REQUEST)
        serailzed_user = UserSerializer(request.user)
        return Response({"key":request.auth.key,"user":serailzed_user.data})
