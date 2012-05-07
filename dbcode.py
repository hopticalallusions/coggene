import sys
import MySQLdb

class dataToSQL : 

	#####
	# TODO
	# this needs a lot more data checking.
	# ran into problems with converting interquartile ranges into floats, because they consist of 2 floats, so the conversion to float type is an error
	# any float sample sizes will also cause some difficulty -- they will be truncated to ints.
	# the genotype field was set to 15 initially, which kept cutting bits off the genotype. This has been extended to 255 after 50 was not enough.
	# the sample size was also changed because 4 bits in a tinyint are not enough to hold our sample sizes
	# the input argument to int changes nothing -- it's still 4 bytes.
	# notes mess up the papers also -- we have some papers where they are differentiated by age in the notes.

	def __init__(self) :
		self.sqlConnection=None
		self.sqlCursor=None
		self.lastSqlResult=None
		self.debugging=True
		self.floatTolerance = 0.0001


	def linkToMySql (self) :

		try :
			self.sqlConnection = MySQLdb.connect(host = "localhost", user = "coggeneAdmin", passwd = "mendelian", db = "coggene_data")
			self.sqlCursor = self.sqlConnection.cursor()
		except MySQLdb.Error, e :
			print "error %d : %s" % (e.args[0], e.args[1])
			sys.exit(1)


	def isNumber(self, s) :
		try:
			float(s)
			return True
		except ValueError:
			return False


	def buildSelectCommand (self, tableName = "", rowNames=[], data=[], floatDataNames=[], floatData=[] ) :
		# cursory check for faulty input
		if tableName == "" :
			print "ERROR! main::buildSelectCommand -- null table name"
			return False
		if len(rowNames) != len(data) :
			print "ERROR! main::buildSelectCommand -- row length mismatch"
			return False
		# begin building command
		mysqlcommand = "select id"
		for idx in range(len(floatDataNames)) :
			mysqlcommand = mysqlcommand + ", " + str(floatDataNames[idx])
		mysqlcommand = mysqlcommand + " from " + tableName + " where ( "
		for idx in range(len(rowNames)) :
			mysqlcommand = mysqlcommand + " ( " + str(rowNames[idx]) + " = '" + str(data[idx]) + "' )"
			if idx < (len(rowNames)-1) :
				mysqlcommand = mysqlcommand + " and "
		for idx in range(len(floatDataNames)) :
			valueToInsert = floatData[idx]
			if self.isNumber(valueToInsert) :
				mysqlcommand = mysqlcommand + " and( ABS( " +str(floatDataNames[idx]) + " - " + str(floatData[idx]) + " ) <= "+ str(self.floatTolerance) +" ) "
			else :
				mysqlcommand = mysqlcommand + " and ( " + str(rowNames[idx]) + " = '" + str(data[idx]) + "' )"
		mysqlcommand = mysqlcommand + " )"
		return mysqlcommand


	def lineExists(self, tableName = "", rowNames=[], data=[]) :
		# cursory check for faulty input
		if tableName == "" :
			print "ERROR! main::lineExists -- null table name"
			return False
		if len(rowNames) != len(data) :
			print "ERROR! main::lineExists -- row length mismatch %i != %i" % (len(rowNames) , len(data))
			return False
		# begin building command
		mysqlcommand = "select "
		for idx in range(len(rowNames)) :
			mysqlcommand = mysqlcommand + rowNames[idx]
			if idx < (len(rowNames)-1) :
				mysqlcommand = mysqlcommand + ", "
		mysqlcommand = mysqlcommand + " from " + tableName + " where ("
		for idx in range(len(rowNames)) :
			mysqlcommand = mysqlcommand + rowNames[idx] + " = '" + data[idx] + "'"
			if idx < (len(rowNames)-1) :
				mysqlcommand = mysqlcommand + " and "
		mysqlcommand = mysqlcommand + " )"
		if self.debugging :
			print "main::lineExists -- \n\tmysqlcommand = %s" % mysqlcommand
		self.sqlCursor.execute(mysqlcommand)
		self.lastSqlResult = self.sqlCursor.fetchall()
		if self.debugging :
			print self.lastSqlResult
		if len(self.lastSqlResult) > 0 :
			return True
		else :
			return False


	def buildInsertCommand (self, idNumber=-1, tableName = "", rowNames=[], data=[], floatDataNames=[], floatData=[] ) :
		""" This function builds an insert command for the database. It can only handle one line of data at a time!"""
		# cursory check for faulty input
		# TODO -- each of these initial checks could perform more work to ensure that the input is valid, but unless this becomes a problem, we are leaving it like this.
		if idNumber == -1 :
			print "ERROR! main::buildInsertCommand -- idNumber"
			return False
		if tableName == "" :
			print "ERROR! main::buildInsertCommand -- null table name"
			return False
		if len(rowNames) != len(data) :
			print "ERROR! main::buildInsertCommand -- row length mismatch  %i != %i " % (len(rowNames), len(data))
			return False
		# begin building command
		rowNames.append("ID")
		data.append(idNumber)
		mysqlcommand = "insert into " + tableName + " ( "
		for idx in range(len(rowNames)) :
			mysqlcommand = mysqlcommand + str(rowNames[idx])
			if idx < (len(rowNames)-1) :
				mysqlcommand = mysqlcommand + ", "
		for idx in range(len(floatDataNames)) :
			mysqlcommand = mysqlcommand + ", " + str(floatDataNames[idx])
		mysqlcommand = mysqlcommand + " ) values ( "
		for idx in range(len(rowNames)) :
			if self.isNumber(data[idx]) :
				mysqlcommand = mysqlcommand + " '" + str(round(float(data[idx]))) + "'"
			else :
				mysqlcommand = mysqlcommand + " '" + str(data[idx]) + "'"
			if idx < (len(rowNames)-1) :
				mysqlcommand = mysqlcommand + ", "
		for idx in range(len(floatDataNames)) :
			mysqlcommand = mysqlcommand + ", '" + str(floatData[idx]) + "'"
		mysqlcommand = mysqlcommand + " )"
		return mysqlcommand


	def retrieveID(self, tableName = "", rowNames=[], data=[], floatDataNames=[], floatData=[]) :
		"""general function to retrieve ID given arguments."""
		# cursory check for faulty input
		if tableName == "" :
			print "ERROR! main::retrieveID -- null table name"
			return False
		if len(rowNames) != len(data) :
			print "ERROR! main::retrieveID -- row length mismatch"
			print tableName
			print rowNames
			print data
			return False
		# retrieve ID
		mysqlcommand = self.buildSelectCommand(tableName, rowNames, data, floatDataNames, floatData)
		if self.debugging :
			print mysqlcommand
		self.sqlCursor.execute(mysqlcommand)
		self.lastSqlResult = self.sqlCursor.fetchall()
		if self.debugging :
			print self.lastSqlResult
		if len(self.lastSqlResult) == 1 :
			# TODO -- check that this [0][0] is a safe assumption, or implement a safer method. check if is number?
			return self.lastSqlResult[0][0]
		elif len(self.lastSqlResult) == 0 :
			mysqlcommand = "select max(id) as 'maxid' from "+tableName
			if self.debugging :
				print mysqlcommand
			self.sqlCursor.execute(mysqlcommand)
			self.lastSqlResult = self.sqlCursor.fetchall()
			if self.debugging :
				print self.lastSqlResult
			if self.lastSqlResult[0][0] == None :
				newIDValue = 1
			else :
				newIDValue = int(self.lastSqlResult[0][0]) + 1
			mysqlcommand = self.buildInsertCommand(newIDValue, tableName, rowNames, data, floatDataNames, floatData)
			if self.debugging :
				print mysqlcommand
			self.sqlCursor.execute(mysqlcommand)
			self.lastSqlResult = self.sqlCursor.fetchall()
			if self.debugging :
				print self.lastSqlResult
			return newIDValue
		else :
			print "ERROR! : sqlPopulator::getGeneID -- there may be a duplicate for gene = %s refSeq = %s" % (geneName, refSeq)
		return idValue


	def processFile(self, filename="") :
		if filename == "" :
			print "ERROR!"
			return False
		self.linkToMySql()
		filehandle = open(filename)
		filecontents=filehandle.readlines()
		headers=filecontents[0].strip('"\n').split('"\t"')
		print headers
		columnCount = len(headers)
		dataMap={}
		for lineIdx in range(1,len(filecontents)) :
			dataArray=filecontents[lineIdx].strip('"\n').split('\t')
			if self.debugging :
				print "length headers = %i  data = %i" % (len(headers),len(dataArray))
				print dataArray
			for idx in range(len(headers)) :
				dataMap[headers[idx]]=dataArray[idx].strip('"')
			if self.debugging :
				print dataMap
		#	"Papers"
			if self.lineExists("Papers",["pID"],[ dataMap["Article PMID"]]) == False :
				mysqlcommand = "insert into Papers (pID, notes) values ( '" + str(dataMap["Article PMID"]) + "', '" +dataMap["Notes"]+"' )"
				if self.debugging :
					print mysqlcommand
				self.sqlCursor.execute(mysqlcommand)
				self.lastSqlResult = self.sqlCursor.fetchall()
				if self.debugging :
					print self.lastSqlResult
		#	categoryNames=["pID", "notes"]
			fileDataName=[ dataMap["Article PMID"],dataMap["Notes"]]
		#	"Genetics"
			geneID = self.retrieveID("Genetics",["gene","refSeq"],[dataMap["Gene"],dataMap["Reference Sequence"]])
		#	"CognitiveDomain"
			cognitiveID = self.retrieveID("CognitiveDomain",["domain"],[dataMap["cognition"]])
		#	"Measures"
			measureID = self.retrieveID("Measures",["task","indicator"],[dataMap["Task Name"],dataMap["Performance Indicator"]])
		#	"Results"
			resultID = self.retrieveID("Results",["pID","geneID","measureID","cogID","errorType","genotype","sampleSize"],[dataMap["Article PMID"],geneID,measureID,cognitiveID,dataMap["Err Type"],dataMap["Genotype 1"],dataMap["SS1"]], ["mean","error"], [dataMap["Mean 1"],dataMap["SD1"]])
			resultID = self.retrieveID("Results",["pID","geneID","measureID","cogID","errorType","genotype","sampleSize"],[dataMap["Article PMID"],geneID,measureID,cognitiveID,dataMap["Err Type"],dataMap["Genotype 2"],dataMap["SS2"]], ["mean","error"], [dataMap["Mean 2"],dataMap["SD2"]])
			dataMapGenotype3 = dataMap.get("Genotype 3",0)
			if  (dataMapGenotype3 != 0) and (dataMapGenotype3 != '') and ( dataMapGenotype3 != None ):
				resultID = self.retrieveID("Results",["pID","geneID","measureID","cogID","errorType","genotype","sampleSize"],[dataMap["Article PMID"],geneID,measureID,cognitiveID,dataMap["Err Type"],dataMap["Genotype 3"],dataMap["SS3"]], ["mean","error"], [dataMap["Mean 3"],dataMap["SD3"]])


'''

#### Test Code

from dbcode import dataToSQL
aa=dataToSQL()
aa.processFile("db.csv")


use geneCogs2;

drop table Genetics;
drop table Papers;
drop table Results;
drop table Measures;
drop table CognitiveDomain;

CREATE TABLE `Genetics` (
  `ID` int(10) unsigned NOT NULL,
  `gene` varchar(256) NOT NULL,
  `refSeq` varchar(256) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `Papers` (
  `pID` int(10) unsigned NOT NULL,
  `notes` text,
  PRIMARY KEY  (`pID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `Results` (
  `ID` int(10) unsigned NOT NULL,
  `pID` int(10) unsigned NOT NULL,
  `geneID` int(10) unsigned NOT NULL,
  `cogID` int(10) unsigned NOT NULL,
  `measureID` int(10) unsigned NOT NULL,
  `errorType` varchar(256) NOT NULL,
  `genotype` varchar(256) NOT NULL,
  `sampleSize` int(10) unsigned NOT NULL,
  `mean` float NOT NULL,
  `error` float NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `Measures` (
  `ID` int(10) unsigned NOT NULL,
  `task` varchar(256) NOT NULL,
  `indicator` varchar(256) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `CognitiveDomain` (
  `ID` int(10) unsigned NOT NULL,
  `domain` varchar(256) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
'''



























'''

CREATE TABLE `effectSizes` (
  `effectSizeID` int(10) unsigned NOT NULL,
  `dataID1` int(10) unsigned NOT NULL,
  `dataID2` int(10) unsigned NOT NULL,
  `effectSize` float NOT NULL,
  PRIMARY KEY (`effectSizeID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `genetics` (
  `geneID` int(10) unsigned NOT NULL,
  `gene` varchar(255) NOT NULL,
  `referenceSequence` varchar(255) NOT NULL,
  PRIMARY KEY (`geneID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `articles` (
  `PMID` int(10) unsigned NOT NULL,
  `notes` text,
  PRIMARY KEY (`PMID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `sampleData` (
  `sampleDataID` int(10) unsigned NOT NULL,
  `PMID` int(10) unsigned NOT NULL,
  `geneID` int(10) unsigned NOT NULL,
  `measureID` int(10) unsigned NOT NULL,
  `errorType` varchar(255) NOT NULL,
  `genotype` varchar(255) NOT NULL,
  `sampleSize` int(10) unsigned NOT NULL,
  `mean` float NOT NULL,
  `error` float NOT NULL,
  `statisticalTestName` varchar(255) NOT NULL,
  `statisticalTestResult` float NOT NULL,
  `pValue` float NOT NULL,
  `lowerConfidenceInterval` float NOT NULL,
  `upperConfidenceInterval` float NOT NULL,
  PRIMARY KEY (`sampleDataID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `cognitiveMeasures` (
  `meaureID` int(10) unsigned NOT NULL,
  `task` varchar(255) NOT NULL,
  `indicator` varchar(255) NOT NULL,
  `cognitionID` int(10) NOT NULL,
  PRIMARY KEY (`meaureID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `cognition` (
  `cognitionID` int(10) unsigned NOT NULL,
  `cognitiveDomain` varchar(10) NOT NULL,
  PRIMARY KEY (`cognitionID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



--------------------------------------------------------------


CREATE TABLE `EffectSizes` (
  `ID` int(10) unsigned NOT NULL,
  `dataID1` int(10) unsigned NOT NULL,
  `dataID2` int(10) unsigned NOT NULL,
  `effectSize` float NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `Genetics` (
  `ID` int(10) unsigned NOT NULL,
  `gene` varchar(10) NOT NULL,
  `refSeq` tinytext NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `Papers` (
  `pID` int(10) unsigned NOT NULL,
  `notes` text,
  PRIMARY KEY  (`pID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `Results` (
  `ID` int(10) unsigned NOT NULL,
  `pID` int(10) unsigned NOT NULL,
  `geneID` int(10) unsigned NOT NULL,
  `measureID` int(10) unsigned NOT NULL,
  `errorType` varchar(10) NOT NULL,
  `genotype` varchar(256) NOT NULL,
  `sampleSize` int(10) unsigned NOT NULL,
  `mean` float NOT NULL,
  `error` float NOT NULL,
  `testName` tinytext NOT NULL,
  `testResult` float NOT NULL,
  `pValue` float NOT NULL,
  `lowerConf` float NOT NULL,
  `upperConf` float NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `Measures` (
  `ID` int(10) unsigned NOT NULL,
  `task` tinytext NOT NULL,
  `indicator` tinytext NOT NULL,
  `cogDomainID` int(10) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `CognitiveDomain` (
  `ID` int(10) unsigned NOT NULL,
  `domain` varchar(10) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;




root
letmein


use mysql;
update user set Password=PASSWORD('l3tm31n') where user='root';
flush privileges;
create geneCogs2;
use geneCogs2;
grant select, insert, update, delete on geneCogs2.* to webmuse@phenodev.cs.ucla.edu;
grant select, insert, update, delete on geneCogs2.* to webmuse@localhost;





'''
