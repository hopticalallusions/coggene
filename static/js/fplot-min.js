/**
* UCLA CogGene
* Raphael-based forest plotter
* Contact nnovak at UCLA dot edu with questions
*/
var devMode=false;var continueLoading=true;if(BrowserDetect.browser=="Firefox"&&BrowserDetect.version<3.6){disableVis("Firefox",3.6)}if(BrowserDetect.browser=="Safari"&&BrowserDetect.version<3){disableVis("Safari",3)}if(BrowserDetect.browser=="Chrome"&&BrowserDetect.version<5){disableVis("Google Chrome",5)}if(BrowserDetect.browser=="Opera"&&BrowserDetect.version<9.5){disableVis("Opera",9.5)}if(BrowserDetect.browser=="Explorer"){$(document).ready(function(){document.getElementById("browserRecommend").innerHTML="<span class='reference'><b><u>Warning</u>:</b> you are using "+BrowserDetect.browser+" but it is highly recommended that you use <a href='http://www.mozilla.com/en-US/firefox/fx/'>Firefox</a> or <a href='http://www.google.com/chrome/intl/en/make/download.html'>Chrome</a>. You may experience performance issues using "+BrowserDetect.browser+". Additionally, some features may not work properly, so please use one of our recommended browsers for a better experience.<br /><br /><hr /><br /></span>"})}function disableVis(a,c){continueLoading=false;$(document).ready(function(){if(c>0){document.getElementById("holder").innerHTML="<b>Your version of "+a+" is out of date. To use the data visualization utility, please update your browser to version "+c+" or above. Note that Firefox or Chrome are recommended for this utility.</b>"}else{document.getElementById("holder").innerHTML="<b> "+a+" is not supported. Please use one of our recommended browsers, <a href='http://www.mozilla.com/en-US/firefox/fx/'>Firefox</a> or <a href='http://www.google.com/chrome/intl/en/make/download.html'>Chrome</a>, to use this visualization utility.</b>"}})}if(continueLoading){var jPlotWhat={results:[{id:1,name:"Genes"},{id:2,name:"Tasks"}]};var firstBackRect;var backRect;var tipText="";var over=false;var metaAnalysisAddressList=new Array();$(document).mousemove(function(a){if(over){$("#tip").css("left",a.pageX+20).css("top",a.pageY+20);$("#tip").html(tipText)}});function addTip(b,a){$(b).mouseenter(function(){tipText=a;$("#tip").show();over=true}).mouseleave(function(){$("#tip").hide();over=false})}Raphael.fn.fplot=function(ae,aj,z,V,d,x,u,W,p,m,l,k,e){m=processArray(p,m);l=processArray(m,l);var r=150;var I=r-30;var U=150;var A=325;var K=50;var g=110;var ai=10;var o=5;var q=5;var b=-45;var y=10;var ad=5;var H=5;var ak=15;var c=5;var a="Helvetica, Arial, sans-serif";var G="http://www.ncbi.nlm.nih.gov/pubmed?term=";var f=getMin(V);var v=getMax(d);var t=v-f;var T=getMinInDataRange(e,x);var h=getMaxInDataRange(e,x);var j=[p,m,l];normalize=function(i){return(i*(ae-A))/t-f*(ae-A)/t+r};denormalize=function(i){return(t*(i-r)+f*(ae-A))/(ae-A)};var aa=I/3;var w=U-K*0.5-y;var am={"font-size":14,"font-family":a,"text-anchor":"start","font-weight":"bold"};this.text(aa/2,w,u[0]).attr(am).rotate(b,aa/2,w);this.text(aa/2+aa,w,u[1]).attr(am).rotate(b,aa/2+aa,w);this.text(aa/2+2*aa,w,u[2]).attr(am).rotate(b,aa/2+2*aa,w);this.text(normalize(v)+g+aa/2,w,u[3]).attr(am).rotate(b,normalize(v)+g+aa/2,w);var F="undef";var E="undef";var D="undef";var B="undef";var S=[1,U-K/2];var Q=[1,U-K/2];var P=[1,U-K/2];var N=[1,U-K/2];for(var ag=0;ag<z.length;ag++){backRect=this.rect(0,U,ae,K,0).attr({fill:(ag%2==0?270:90)+"-#fff-#eef",stroke:"none"});if(ag==0){firstBackRect=backRect}else{backRect.insertBefore(firstBackRect)}var L=this.rect(normalize(V[ag]),U,normalize(d[ag])-normalize(V[ag]),o,q).attr({fill:"90-#043a6b-#ffffff"});if(x[ag]=="meta_all"){var C="<div id='labelFormat'>Overall meta analysis</div> <div id='clickFormat'>Position of this meta analysis diamond represents the sample size-weighted mean of the of all above effect sizes, shown here with its confidence interval of <b>"+V[ag]+"</b> to <b>"+d[ag]+"</b>. <div id='warning'>Note: the meta analytical mean presented here is a composite that may not be accurate.</div>";var Z=this.rect(normalize(z[ag]),U-c*6/2-3,c*6,c*6).attr({fill:"#99FFCC","stroke-dasharray":"..",opacity:0.5}).rotate(45,normalize(z[ag]),U-c*6/2-3);addTip(Z.node,C)}else{if(x[ag]=="meta"){var C="<div id='labelFormat'>Submeta analysis for: "+k[ag]+"</div> <div id='clickFormat'>Position of this meta analysis diamond represents the sample size-weighted mean of the effect sizes specified by the criterion bars to the left, shown here with its confidence interval of <b>"+V[ag]+"</b> to <b>"+d[ag]+"</b>";var Z=this.rect(normalize(z[ag]),U-c*6/2-3,c*6,c*6).attr({fill:"#FFFF99",opacity:0.5,"stroke-dasharray":".."}).rotate(45,normalize(z[ag]),U-c*6/2-3);addTip(Z.node,C)}else{var C="<div id='labelFormat'>"+k[ag]+" (n="+e[ag]+")</div> <div id='clickFormat'>This genotype comparison has an effect size of <b>"+z[ag]+"</b>, which falls within a 95% confidence interval of <b>"+V[ag]+"</b> to <b>"+d[ag]+"</b></div>";ad=H+((e[ag]*(ak))/(h));var M=this.ellipse(normalize(z[ag]),U+o/2,ad,ad).attr({fill:"r(.5, .1)#fff-#ff4f00",opacity:0.5,"stroke-dasharray":".."});addTip(M.node,C)}}var ac=this.text(normalize(z[ag]),U-1.5*ad,z[ag]).attr({"font-size":12,"font-family":a,"text-anchor":"start"});addTip(L.node,C);addTip(ac.node,C);if(x[ag]!="meta_all"){S=generateSubLabelColumn(p,m,l,x,this,ag,z,true,p,F,0,S[1],I/3,S[0],K,0,p[ag],I,ae,u[0],W[0],aj,W[0]);Q=generateSubLabelColumn(p,m,l,x,this,ag,z,false,m,E,I/3,Q[1],I/3,Q[0],K,1,m[ag],I,ae,u[1],W[1],aj,W[0]);P=generateSubLabelColumn(p,m,l,x,this,ag,z,false,l,D,2*I/3,P[1],I/3,P[0],K,2,l[ag],I,ae,u[2],W[2],aj,W[0]);N=generateSubLabelColumn(p,m,l,x,this,ag,z,false,x,B,normalize(v)+g,N[1],I/3,N[0],K,3,x[ag],I,ae,G+x[ag],"href",aj,W[0])}else{S=[S[0],S[1]+K];Q=[Q[0],Q[1]+K];P=[P[0],P[1]+K];N=[N[0],N[1]+K]}F=p[ag];E=m[ag];D=l[ag];B=x[ag];U+=K}var J=this.path("M"+normalize(f)+" "+U+"L"+normalize(v)+" "+U).attr({stroke:"#679Fd2"});var ah=this.path("M"+0+" "+0+"L"+0+" "+U);var af=this.path("M"+ae+" "+0+"L"+ae+" "+U);var O=getYOrigin(f,v);var s=this.path("M"+normalize(O)+" "+0+"L"+normalize(O)+" "+(U+ai*2)).attr({stroke:"#679Fd2"});var ab=this.text(normalize(O)+ai,U-ai,O);var Y=this.text(normalize(f),U-ai,f);var X=this.text(normalize(v),U-ai,v);var al=this.rect(0,0,1,U).attr({stroke:"#679Fd2","stroke-dasharray":"--"});var n=this.text(0,0,0);$(document).mousemove(function(ao){var i=$("table.topCont").css("height");var an=i.substr(0,i.length-2);al.attr({x:(ao.pageX<r+ae-A&&ao.pageX>r?(document.getElementById("displayY").checked?ao.pageX:-10):-10)});n.attr({x:ao.pageX+20,y:ao.pageY-parseFloat(an)-200,text:(ao.pageX<r+ae-A&&ao.pageX>r?(document.getElementById("displayY").checked?roundNumber(denormalize(ao.pageX),2):""):"")})})};function generateSubLabelColumn(f,e,d,m,D,z,n,N,i,L,k,j,a,p,s,U,l,r,P,M,v,V,u){var q={stroke:"#ff4f00","stroke-dasharray":"--"};if(i[z]!=L){p=1}else{p++}if(i[z+1]!=i[z]){var H=k;var F=j;var I=a;var T=p*s;var O={fill:getNextColor(l,U),opacity:1,stroke:"#ffff00","stroke-width":5,"stroke-dasharray":"none"};var A={fill:getNextColor(l,U),fill:getNextColor(l,U),stroke:"none",opacity:1,"stroke-width":1};var S=3;var G=D.rect(H,F,I,T,15).attr(A);var o=D.rect(H+S,F+S,I/2-S*1.5,T-S*2,10).attr({fill:"180-"+getNextColor(l,U)+"-#ffffff:100-"+getNextColor(l,U),opacity:0.8,stroke:"none","stroke-width":1,"stroke-dasharray":"none"});var J={"font-size":14,"font-family":'"Helvetica, Arial, sans-serif"',"text-anchor":"start","font-weight":"bold"};var g=truncateForButton(T,(l+""));if(l=="meta"&&U==3){g=truncateForButton(T,"Submeta analysis")}var E=D.text(H+I/2,F+T-5+3,g).attr(J).rotate(-90,H+I/2,F+T-5);var c={stroke:"none",x:-50,y:-50,height:0,opacity:0.1};var B=D.rect(0,0,P+500,50,0).attr(c);var t=rCheckbox(D,H,F,15,15,5);t.toFront();t.click(function(){thisAddress=f[z];if(U==1){thisAddress+="."+trim(e[z])}if(U==2){thisAddress+="."+trim(e[z])+"."+trim(d[z])}if(U==3){thisAddress=m[z]}var h=this.clicked;if(BrowserDetect.browser=="Explorer"){h=!this.clicked}if(!h){metaAnalysisAddressList.removeItem(thisAddress)}else{metaAnalysisAddressList.push(thisAddress)}});var C="<div id='labelFormat'>Meta analysis</div> <div id='clickFormat'>Click to mark <b>"+l+"</b> for meta analysis. When you are done marking, press the button above to generate a meta analysis plot.</div>";addTip(t.node,C);o.hover(function(h){B.insertAfter(firstBackRect);G.attr(O);B.attr({x:r,y:G.attr("y"),height:G.attr("height"),fill:"180-"+G.attr("fill")+"-#ffffff",stroke:"none","stroke-width":0})},function(h){G.attr(A);B.attr(c)}).click(function(){if(U!=3||(l!="meta"&&U==3)){requestSort(M,v,V)}});G.hover(function(h){G.attr(O);B.insertAfter(firstBackRect);B.attr({x:r,y:this.attr("y"),height:this.attr("height"),fill:"180-"+this.attr("fill")+"-#fff",stroke:"none","stroke-width":0})},function(h){this.attr(A);B.attr(c)}).click(function(){if(U!=3||(l!="meta"&&U==3)){requestSort(M,v,V)}});E.hover(function(h){B.insertAfter(firstBackRect);G.attr(O);B.attr({x:r,y:G.attr("y"),height:G.attr("height"),fill:"180-"+G.attr("fill")+"-#fff",stroke:"none","stroke-width":0})},function(h){G.attr(A);B.attr(c)}).click(function(){if(U!=3||(l!="meta"&&U==3)){requestSort(M,v,V)}});var b="";if(v=="href"){if(U!=3||(l!="meta"&&U==3)){b="<div id='labelFormat'>"+l+"</div> <div id='clickFormat'>Click to search online for this article</div>"}else{b="<div id='labelFormat'>Submeta analysis</div> <div id='clickFormat'>Shown here are the meta analysis diamonds for subgroups of data in this plot. The criterion bars at the left of these rows identify the subgroups for which the diamonds here are plotted.</div>"}}else{if(U>0){b="<div id='labelFormat'>"+l+"</div> <div id='clickFormat'>Click to sort the plot data by <b>"+M+"</b>. These columns will be re-ordered to reflect the sort hierarchy, with <b>"+M+"</b> sorted alphabetically in the first column.</div>"}else{b="<div id='labelFormat'>"+l+"</div> <div id='clickFormat'>The plot is currently sorted by <b>"+M+"</b>. Click a Criterion Bar in another column to sort by that criterion.</div>"}}addTip(o.node,b);addTip(G.node,b);addTip(E.node,b);if(N){var K=getMean(n.slice(i.firstIndexOfLastOccurringBlock(z,L),z+1));var Q=D.path("M"+normalize(K)+" "+j+"L"+normalize(K)+" "+(j+s*p));Q.attr(q)}j+=s*p}return[p,j]}function rCheckbox(e,k,i,l,f,a){var c={fill:"90-#fff-#ccc",stroke:"#000000"};var b={fill:"90-#fff-#ffc",stroke:"#000000"};var j={fill:"90-#f00-#fcc",stroke:"#ff0000"};var d={fill:"90-#f00-#fee",stroke:"#ff0000"};var g=e.rect(k,i,l,f,a);g.clicked=false;g.attr(c);g.hover(function(h){if(!this.clicked){this.attr(b)}else{this.attr(d)}},function(h){if(!this.clicked){this.attr(c)}else{this.attr(j)}}).click(function(){if(!this.clicked){this.clicked=true;this.attr(d)}else{this.clicked=false;this.attr(b)}});return g}function truncateForButton(b,a){var c=b/11;if(a.length>c){return a.substr(0,c)+"..."}else{return a}}function getNextColor(e,b){var a="#"+hex_md5(trim("novak"+e)).substring(0,6);var d="";for(var c=0;c<a.length;c++){if(a.charAt(c)=="0"){d+="B"}else{if(a.charAt(c)=="1"){d+="C"}else{if(a.charAt(c)=="2"){d+="A"}else{if(a.charAt(c)=="3"){d+="6"}else{d+=a.charAt(c)}}}}}return d}function modularGet(b,a){return a[b%a.length]}function getYOrigin(a,b){if(a<0){if(b>0){return 0}else{return roundNumber((b+a)/2,1)}}else{if(a>1){return roundNumber((b+a)/2,1)}else{return 1}}}function getMean(a){var c=0;for(var b=0;b<a.length;b++){c+=a[b]}return c/a.length}function roundNumber(b,c){var a=Math.round(b*Math.pow(10,c))/Math.pow(10,c);return a}function getMin(b){var a=10000000000;for(var c=0;c<b.length;c++){if(b[c]<a){a=b[c]}}return a}function getMinInDataRange(b,d){var a=10000000000;for(var c=0;c<b.length;c++){if(d[c]=="meta_all"||d[c]=="meta"){return a}if(b[c]<a){a=b[c]}}return a}function getMax(b){var c=-10000000000;for(var a=0;a<b.length;a++){if(b[a]>c){c=b[a]}}return c}function getMaxInDataRange(b,d){var c=-10000000000;for(var a=0;a<b.length;a++){if(d[a]=="meta_all"||d[a]=="meta"){return c}if(b[a]>c){c=b[a]}}return c}function trim(a){a=a.replace(/(^\s*)|(\s*$)/gi,"");a=a.replace(/[ ]{2,}/gi," ");a=a.replace(/\n /,"\n");return a}Array.prototype.firstIndexOfLastOccurringBlock=function(b,a){var d=b;for(var c=b;c>0;c--){if(this[c]==a){d=c}else{return d}}return 0};Array.prototype.removeItem=function(b){var a=0;while(a<this.length){if(this[a]==b){this.splice(a,1)}else{a++}}return this};$(document).ready(function(){if(devMode){$("#metaDiv").fadeIn("fast");var a=1000;R=Raphael("holder",a,jData1.means.length*50+150);R.fplot(a,"CHRM2",jData1.means,jData1.lowerConfidenceInterval,jData1.uppperConfidenceInterval,jData1.labels,jData1.subLabelsText,jData1.subLabelsDB,jData1.subLabelsA,jData1.subLabelsB,jData1.subLabelsC,jData1.genotypes,jData1.pooledSampleSize);return}$("#tip").hide();$("#spinner").hide();$("#spinnerIE").hide();if(BrowserDetect.browser!="Explorer"){$("#spinner").bind("ajaxSend",function(){$(this).fadeIn("fast")}).bind("ajaxComplete",function(){$(this).fadeOut("fast")})}else{$("#spinnerIE").bind("ajaxSend",function(){$(this).fadeIn("fast")}).bind("ajaxComplete",function(){$(this).fadeOut("fast")})}document.getElementById("displayYCheckbox").style.visibility="hidden";$("#fb1").flexbox("/static/json_plotWhat.txt",{width:350,watermark:"What do you want to explore?",onSelect:function(){var b=(devMode?jGenes:"/forestPlotDropdown/?plotType="+this.value);$("#fb2_input").remove();$("#fb2_hidden").remove();$("#fb2_arrow").remove();$("#fb2_ctr").remove();$("#fb1-r").html("<br/><br/>Please specify:").fadeIn("slow");$("#fb2").flexbox(b,{width:350,watermark:"Choose "+(this.value=="Genes"?"gene":"task")+" here",paging:false,maxVisibleRows:15,onSelect:function(){if(this.value=="ALL"){if(confirm("Choosing 'ALL' will plot all of the data stored in our database, which may take awhile and may cause your browser to appear unresponsive while the forest plot is being generated. To continue, press OK.")){launchVis(this.value,"none")}else{return}}else{launchVis(this.value,"none")}}}).fadeIn("slow")}})});function processArray(e,d){for(var b=0;b<e.length;b++){if(e[b]!=e[b+1]){if(d[b]==d[b+1]){var c=d[b];for(var a=b+1;a<d.length;a++){if(d[a]==c){d[a]+=" "}}}}}return d}var R;function launchVis(b,c,a){metaAnalysisAddressList=new Array();$.getJSON("/forestPlotGetData/?plotSubType="+b+(c=="none"?"":("&sortBy="+c))+(a==undefined?"":("&dataFilter="+a.join("^"))),function(e){$("#metaDiv").fadeIn("slow");$("#holder").html("");var f=0;if(e.means==undefined){f=1}else{if(e.means.length==0){f=2}}if(f!=0){$("#holder").html("<div id='error'>Sorry! There was an error processing this request; we cannot provide these data for you at this time. [Error Code: "+f+"]</div><br/>");return}document.getElementById("displayYCheckbox").style.visibility="visible";if(R!=undefined){if(BrowserDetect.browser!="Explorer"){R.remove()}}var d=1000;R=Raphael("holder",d,e.means.length*50+150);R.fplot(d,b,e.means,e.lowerConfidenceInterval,e.uppperConfidenceInterval,e.labels,e.subLabelsText,e.subLabelsDB,e.subLabelsA,e.subLabelsB,e.subLabelsC,e.genotypes,e.pooledSampleSize);$("#metasubmitbutton").unbind("click");$("#metasubmitbutton").click(function(){launchVis(b,c,metaAnalysisAddressList)})})}function requestSort(a,c,b){if(c=="href"){window.open(a)}else{launchVis(b,c)}}};
