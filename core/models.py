from django.db import models
from django.contrib.auth.models import AbstractUser


designation_choices = (
('computer','computer'),
('chemistry','chemistry'),
('physics','physics'),
('english','english'),
('mathematics','mathematics'),
('social sciences','social sciences'),
('history','history'))

gender_choices = (('m','male'),('f','female'))

# Create your models here.
class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)

class Student(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    firstname = models.CharField(max_length=256)
    surname = models.CharField(max_length=256)
    gender = models.CharField(max_length=6,choices=gender_choices)
    designation = models.CharField(max_length=50,choices=designation_choices)

    def __str__(self):
        return self.user.username

class Teacher(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    firstname = models.CharField(max_length=256)
    surname = models.CharField(max_length=256)
    gender = models.CharField(max_length=6,choices=gender_choices)
    def __str__(self):
        return self.user.username

class Assignment(models.Model):
    teacher = models.ForeignKey(Teacher,on_delete=models.CASCADE)
    title = models.CharField(max_length=120)

    def __str__(self) -> str:
        return self.title

class GradedAssignment(models.Model):
    assignment = models.ForeignKey(Assignment,on_delete=models.SET_NULL,blank=True,null=True)
    student = models.ForeignKey(Student,on_delete=models.CASCADE)
    grade = models.FloatField()

    def __str__(self) -> str:
        return self.student.user.username +'-- '+self.assignment.title

class Choice(models.Model):
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title
class Question(models.Model):
    question = models.CharField(max_length=200)
    choices = models.ManyToManyField(Choice)
    answer = models.ForeignKey(Choice,null = True,blank = True, related_name='answer', on_delete=models.SET_NULL)
    order = models.SmallIntegerField()
    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE,related_name="questions")

    def __str__(self):
        return self.question + ' ==> '+ self.assignment.title


