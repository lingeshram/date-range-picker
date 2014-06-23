 $(function() {
 

 var globalResDates = new fromToDate("from-input","to-input"); // create an object for from and to date range
	globalResDates.initialize();
	
	
 var globalResDates1 = new fromToDate("from-input1","to-input1");
	globalResDates1.lang = 'zh';
	globalResDates1.fromMin = 5;
	globalResDates1.toMin = 6;
	globalResDates1.fromMax = 10;
	globalResDates1.toMax = 10;
	globalResDates1.stayMin = 3;
	globalResDates1.stayMax = 5;
	globalResDates1.useCookie = 0;
	globalResDates1.initialize();
	
	
	// when user click submit button fetching date values using created objects
	$('#submit-date').click(function(){
	
	
	console.log('from-time---' + globalResDates.fromTime);
	console.log('from-day---' + globalResDates.fromDay);
	console.log('from-month---' + globalResDates.fromMonth);
	console.log('from-year---' + globalResDates.fromYear);
	console.log('from-date---' + globalResDates.fromDate);
	
	console.log('to-time---' + globalResDates.toTime);
	console.log('to-day---' + globalResDates.toDay);
	console.log('to-month---' + globalResDates.toMonth);
	console.log('to-year---' + globalResDates.toYear);
	console.log('to-date---' + globalResDates.toDate);
	
	console.log('####################');
	
	console.log('from-time---' + globalResDates1.fromTime);
	console.log('from-day---' + globalResDates1.fromDay);
	console.log('from-month---' + globalResDates1.fromMonth);
	console.log('from-year---' + globalResDates1.fromYear);
	console.log('from-date---' + globalResDates1.fromDate);
	
	console.log('to-time---' + globalResDates1.toTime);
	console.log('to-day---' + globalResDates1.toDay);
	console.log('to-month---' + globalResDates1.toMonth);
	console.log('to-year---' + globalResDates1.toYear);
	console.log('to-date---' + globalResDates1.toDate);
	
	});
	
});