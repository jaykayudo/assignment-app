from dataclasses import field
import imp
from pyexpat import model
from turtle import title
from rest_framework.authtoken.models import Token
from rest_framework import serializers
from .models import GradedAssignment, Teacher, User, Assignment, Question, Choice, Student



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','is_student','is_teacher']

class StringRelatedField(serializers.StringRelatedField):
    def to_internal_value(self, data):
        return data
        
class TokenSerializer(serializers.ModelSerializer):
    user  = UserSerializer()
    class Meta:
        model = Token
        fields = ['key','user']

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = "__all__"

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many = True)
    answer = serializers.SerializerMethodField()
    class Meta:
        model = Question
        fields = "__all__"
    def get_answer(self,obj):
        answer = ChoiceSerializer(obj.answer)
        return answer.data

class AssignmentSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    teacher = StringRelatedField(many= False)
    class Meta:
        model = Assignment
        fields = "__all__"
    
    def get_questions(self,obj):
        questions = QuestionSerializer(obj.questions.all(),many = True)
        return questions.data
    def create_class(self,request):
        data= request.data
        assignment = Assignment()
        user = User.objects.get(username = data['teacher'])
        teacher = Teacher.objects.get(user=user)
        assignment.teacher= teacher
        assignment.title = data["title"]
        assignment.save()
        for x in data["questions"]:
            question = Question()
            question.assignment = assignment
            question.question = x["question"]
            answer = Choice.objects.create(title = x['answer'])
            question.answer = answer
            question.order = x["order"]
            question.save()
            for y in x["choices"]:
                if Choice.objects.filter(title = y['title']).exists():
                    choice = Choice.objects.filter(title = y['title'])[0]
                    question.choices.add(choice)
                else:
                    choice = Choice.objects.create(title = y["title"])
                    question.choices.add(choice)
            question.save()
        return assignment

class GradedAssignmentSerializer(serializers.ModelSerializer):
    student = StringRelatedField(many=False)
    assignment = serializers.PrimaryKeyRelatedField(queryset = Assignment.objects.all())
    assignment_name = serializers.SerializerMethodField()
    class Meta:
        model = GradedAssignment
        fields= "__all__"
    
    def get_assignment_name(self,object):
        return AssignmentSerializer(object.assignment,many=False).data['title']
    
    def create_obj(self,request):
        data = request.data
        assignment = Assignment.objects.get(id = data['assignment'])
        student = Student.objects.get(user = request.user)
        gradedAss = GradedAssignment.objects.create(assignment = assignment, student = student, grade = data['grade'])

        return gradedAss

class TeacherSerializer(serializers.ModelSerializer):
    user = StringRelatedField(many = False)
    class Meta:
        model = Teacher
        fields = "__all__"
    def create_obj(self,request):
        data = request.data
        user = User.objects.get(username = data['user'])
        user.is_teacher = True
        user.save()
        teacher = Teacher()
        teacher.firstname = data['firstname']
        teacher.surname = data['surname']
        teacher.user = user
        teacher.gender = data['gender']
        teacher.save()
        return teacher

class StudentSerializer(serializers.ModelSerializer):
    user = StringRelatedField(many = False)
    class Meta:
        model = Teacher
        fields = "__all__"
    
    def create_obj(self,request):
        data = request.data
        user = User.objects.get(username = data['user'])
        user.is_student = True
        user.save()
        student = Student()
        student.firstname = data['firstname']
        student.surname = data['surname']
        student.user = user
        student.gender = data['gender']
        student.save()
        return student
