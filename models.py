from django.db import models
from django.http import HttpResponse, Http404
from django.template.loader import get_template
from django.template import Context
from django.shortcuts import render_to_response
import json
#import simplejson as json
#modified for debian installation
from xml.dom import minidom
import os

# Create your models here.
# Create your views here.



from django import forms

class ContactForm(forms.Form):
	name = forms.CharField(max_length=100, min_length=8)
	sender = forms.EmailField()
	subject = forms.CharField(max_length=100, min_length=10)
	message = forms.CharField(max_length=5000, min_length=20, widget=forms.Textarea(attrs={'rows':10, 'cols':75}))
	cc_myself = forms.BooleanField(required=False)



