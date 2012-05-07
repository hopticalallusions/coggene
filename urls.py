from django.conf.urls.defaults import patterns, include, url
import views

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'coggene.views.home', name='home'),
    # url(r'^coggene/', include('coggene.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^$', views.indexPage),
    url(r'^methods/', views.methodsPage),
    url(r'^references/', views.referencesPage),
    url(r'^forestPlotDropdown/$', views.forestPlotDropdown),
    url(r'^forestPlotGetData/$', views.forestPlotGetData),
    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^contact/', views.contact),
    url(r'^thanks/', views.thanks),
    # tell robots they can index the site. Resolves 404 error on robots.txt
    url(r'^robots\.txt$', lambda r: HttpResponse("User-agent: *\nDisallow: ", mimetype="text/plain"))

    # 404 error

    # 500 error

    # 403 error

)


#urlpatterns = patterns('',
#    (r'^media/?P<path>.*$', 'django.views.static.serve', {'document_root' : settings.MEDIA_ROOT}),
    # Example:
    # (r'^hwprj/', include('hwprj.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs'
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # (r'^admin/(.*)', admin.site.root),
#)
