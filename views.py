# Create your views here.
from django.http import HttpResponse, Http404
from django.template.loader import get_template
from django.template import Context
from django.shortcuts import render_to_response
import json
#import simplejson as json
#modified for debian specific errors.
from xml.dom import minidom
import os


def indexPage(request):
    """display the index page"""
    return render_to_response('templates/index.html')

def methodsPage(request):
    """display the methods page"""
    return render_to_response('templates/methods.html')

def contactPage(request):
    """display the contact page"""
    return render_to_response('templates/contact.html')

def referencesPage(request):
    """display the references page"""
    return render_to_response('templates/references.html')

def forestPlotDropdown(request) :
        """"""
        if 'plotType' in request.GET and request.GET['plotType'] :
		plotTypeRequest = request.GET['plotType']
		from geneCogsDB import geneCogsDB
		queryDevice = geneCogsDB()
		tojsonify = queryDevice.getSubTypes(plotTypeRequest)
	else :
		tojsonify = {"errorString" : "plotType does not exist in input!" }
	jsonified=json.dumps(tojsonify)
	return HttpResponse(jsonified, mimetype="application/json")

def forestPlotGetData(request) :
	""""""
	if "plotSubType" in request.GET and request.GET['plotSubType'] :
		plotDataRequest = request.GET["plotSubType"]
	else :
		tojsonify = {"errorstring" : "plotSubType does not exist in input" }
	if "sortBy" in request.GET and request.GET['sortBy'] :
		sortBy = request.GET['sortBy']
	else :
		sortBy = ""
	if "dataFilter" in request.GET and request.GET['dataFilter'] :
		dataFilter = request.GET['dataFilter']
	else :
		dataFilter = ""
	from geneCogsDB import geneCogsDB
	queryDevice = geneCogsDB()
	tojsonify = queryDevice.getData(plotDataRequest, sortBy, dataFilter)
	jsonified = json.dumps(tojsonify)
	return HttpResponse(jsonified, mimetype="application/json")


from models import ContactForm
from django.core.context_processors import csrf
from django.template import RequestContext
from django.http import HttpResponseRedirect

def contact(request) :
	if request.method == 'POST' :
		form = ContactForm(request.POST)
		if form.is_valid():
			subject = form.cleaned_data['subject']
			message = form.cleaned_data['message']
			sender = form.cleaned_data['sender']
			cc_myself = form.cleaned_data['cc_myself']

			recipients = ['sellinstuff@neurojet.net', 'nic.novak@gmail.com']
			if cc_myself :
				recipients.append(sender)
			from django.core.mail import send_mail
			send_mail("COGGENE :: "+subject, message, sender, recipients)
			return HttpResponseRedirect('/thanks/')
	else :
		form = ContactForm()
	c = { 'form' : form }
	return render_to_response('templates/contact.html', c, context_instance=RequestContext(request) )

def thanks(request) :
	return render_to_response('templates/thankyou.html')

