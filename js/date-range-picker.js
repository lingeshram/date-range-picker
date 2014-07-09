/*

Version: 1.0
Created: 23 June 2014
Updated: 23 June 2014
Author: Lingeshram
Description: Jquery plugin for date range selector with multiple language support

The MIT License (MIT)

Copyright (c) 2014 lingeshram

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

More plug-ins @ http://lingesh.com
*/

function fromToDate(fromId,toId)
{
	try
	{
		this.from = fromId;
		this.to = toId;
		this.lang = 'auto';  // it may be like en,de or fr etc... it will taken from html tag lang attribute
		this.fromMin = -1; //yesterday
		this.toMin = 0; //today
		this.fromMax = 350; //350 days
		this.toMax = 99;	//99 days
		this.stayMin = 1; //1 day
		this.stayMax = 99; //99 days
		this.fromSelected = 0; //should in miliseconds
		this.toSelected = 0; //should in miliseconds
		this.useCookie = 1; // 1 to use cookie 0 to don't use cookie
		this.fromHeader = '';
		this.toHeader = '';
		this.fromHeaderHTML = '';
		this.toHeaderHTML = '';
		this.fromFooterHTML = '';
		this.toFooterHTML = '';	
		this.showFooter = 1; // 1 to show 0 to hide
		this.resetCaption = '';
		this.showReset = 1; // 1 to show 0 to hide
		this.fromTitle = ''; // if there is no value then it will take automatically for locale
		this.toTitle = ''; // if there is no value then it will take automatically for locale
		this.fromPlaceholder = ''; // if there is no value then it will take automatically for locale
		this.toPlaceholder = ''; // if there is no value then it will take automatically for locale
		this.monthFormat = 0; // month format if 1 then that start from 0-11 if 0 then 1-12
		
		//output variables
		this.fromTime = 0;
		this.fromDay = '';
		this.fromMonth = '';
		this.fromYear = '';
		this.fromDate = '';
		this.toTime = 0;
		this.toDay = '';
		this.toMonth = '';
		this.toYear = '';
		this.toDate = '';
		
		//call back functions
		this.fromOnFocus = '';
		this.fromOnBlur = '';
		this.fromOnSelect = '';
		this.toOnFocus = '';
		this.toOnBlur = '';
		this.toOnSelect = '';
		this.onReset = '';
		
		//internal variables
		this.fromMinVal = {};
		this.fromMaxVal = {};
		this.toMinVal = {};
		this.toMaxVal = {};
		var that = {};
		
		//initializeDate
		this.initializeDate = function()
		{
		
			this.setLabel();			
						
			this.mobileView();
			
			$(window).resize(function(){				
				$('#' + that.to).datepicker("hide");
				$('#' + that.from).datepicker("hide");
				$('#' + that.to).blur();
				$('#' + that.from).blur();				
				that.mobileView();			
			});
			
			
			var fromFormat = $.datepicker.regional[this.lang];
			var toFormat = $.datepicker.regional[this.lang];
			
			$( "#" + this.from).datepicker($.datepicker.regional[this.lang]);
			$( "#" + this.to).datepicker($.datepicker.regional[this.lang]);
			
			//set default date values for from
			this.setFromDateOption({
				"minDate":this.fromMinVal,
				"maxDate":this.fromMaxVal,
				"onSelect": this.fromOnSelectFunc,
				"beforeShowDay" : this.dateHighLight
			});
			
			//set default date values for to	
			this.setToDateOption({
				"minDate":this.toMinVal,
				"maxDate":this.toMaxVal,
				"onSelect": this.toOnSelectFunc,
				"beforeShowDay" : this.dateHighLight
				
			});
			
			this.setSelectedDates();
			this.setAttributes();
			this.storeDate(this.to);
			this.storeDate(this.from);
			
		}
		
		//set mobile view
		this.mobileView = function()
		{
			if($(window).width()<=630)
				{
					$.datepicker.setDefaults(
						$.extend({
								numberOfMonths: 1,
								constrainInput: true
							}
						)
					);
				}
				else
				{
					$.datepicker.setDefaults(
						$.extend({
								numberOfMonths: 2,
								constrainInput: true
							}
						)
					);
				}
		}
		
		// set title and placeholder
		this.setAttributes = function()
		{
			$('#' + this.from).attr('title',this.fromTitle);
			$('#' + this.to).attr('title',this.toTitle);
		if (this.placeholderIsSupported()) 
		{
			$('#' + this.from).attr('placeholder',this.fromPlaceholder);
			$('#' + this.to).attr('placeholder',this.toPlaceholder);
		} else {	
		
				that.notsupportedPlaceholder();				
				
				$('#' + this.from).focus(function(){

					if(that.getFromDate()==that.fromPlaceholder)
					{
						$(this).val('');
					}
				
				});
				$('#' + this.to).focus(function(){
				
					if(that.getToDate()==that.toPlaceholder)
					{
						$(this).val('');
					}
				
				});
				
				$('#' + this.from + ', ' + '#' + this.to).blur(function(){				
						that.notsupportedPlaceholder();
				});
			
			}
			
		}
		
		this.notsupportedPlaceholder = function()
		{
			setTimeout(function(){
				if(that.getFromDate()=='' || that.getFromDate()==that.fromPlaceholder)
				{
					$('#' + that.from).val(that.fromPlaceholder);
					$('#' + that.from).addClass('ui-datepicker-placeholder');
				}
				else
				{
					$('#' + that.from).removeClass('ui-datepicker-placeholder');
				}
				if(that.getToDate()=='' || that.getToDate()==that.toPlaceholder)
				{
					$('#' + that.to).val(that.toPlaceholder);
					$('#' + that.to).addClass('ui-datepicker-placeholder');
				}
				else
				{
					$('#' + that.to).removeClass('ui-datepicker-placeholder');
				}
				
			},400);
		}
		
		this.placeholderIsSupported = function () {
			var test = document.createElement('input');
			return ('placeholder' in test);
		}
		
		//set Default label
		this.setLabel = function(){
		
			if(this.fromHeader=='')
			{
				this.fromHeader = $.datepicker.regional[this.lang]['selectFromCaption'];
			}
			
			if(this.toHeader=='')
			{
				this.toHeader = $.datepicker.regional[this.lang]['selectToCaption'];
			}
			
			if(this.fromFooterHTML=='')
			{
				this.fromFooterHTML = '<div class="date-range-picker-footer"><span class="availableCaption"><span class="ui-state-default"></span>' + $.datepicker.regional[this.lang]['availableCaption'] + '</span><span class="unavailableCaption"><span class="ui-state-default"></span>' + $.datepicker.regional[this.lang]['unavailableCaption'] + '</span><span class="selectedCaption"><span class="ui-state-default"></span>' + $.datepicker.regional[this.lang]['selectedCaption'] + '</span></div>';
			}
			
			if(this.toFooterHTML=='')
			{
				this.toFooterHTML = '<div class="date-range-picker-footer"><span class="availableCaption"><span class="ui-state-default"></span>' + $.datepicker.regional[this.lang]['availableCaption'] + '</span><span class="unavailableCaption"><span class="ui-state-default"></span>' + $.datepicker.regional[this.lang]['unavailableCaption'] + '</span><span class="selectedCaption"><span class="ui-state-default"></span>' + $.datepicker.regional[this.lang]['selectedCaption'] + '</span></div>';
			}
			
			if(this.resetCaption=='')
			{
				this.resetCaption = $.datepicker.regional[this.lang]['resetCaption'];
			}
			
			if(this.fromTitle=='')
			{
				this.fromTitle = $.datepicker.regional[this.lang]['fromTitle'];
			}
			
			if(this.toTitle=='')
			{
				this.toTitle = $.datepicker.regional[this.lang]['toTitle'];
			}
			
			if(this.fromPlaceholder=='')
			{
				this.fromPlaceholder = $.datepicker.regional[this.lang]['fromPlaceholder'];
			}
			
			if(this.toPlaceholder=='')
			{
				this.toPlaceholder = $.datepicker.regional[this.lang]['toPlaceholder'];
			}
		}
		
		//set Selected dates
		this.setSelectedDates = function()
		{
			if(this.fromSelected!=0)
			{
				var dateObj = new Date(this.fromSelected);
				$("#" + this.from).datepicker( "setDate", dateObj);
			}
			else
			{
				this.restoreDate(this.from);				
			}
			
			this.fromOnSelectFunc('restore');
			
			if(this.toSelected!=0)
			{
				var dateObj = new Date(this.toSelected);
				this.setDate(this.to,dateObj);
			}
			else
			{
				this.restoreDate(this.to);
			}
		}
		
		// on selection of to date
		this.toOnSelectFunc = function(selectedDate)
		{
			if(that.toOnSelect!='')
			{
				that.toOnSelect (selectedDate);
			}
			
			that.storeDate(that.to);
		}
		
		// on selection of from date
		this.fromOnSelectFunc = function(selectedDate)
		{
			// reset to date depend on from date	
			if(selectedDate=='' || selectedDate=='restore')
			{
				var dateObj = that.getDateObj(that.from);
			}
			else
			{
				dateObj = $(this).datepicker('getDate');
			}

			var tomin = that.getDayDiffObj(that.stayMin,dateObj);
		
			if(tomin>that.fromMaxVal)
			tomin = that.fromMaxVal;
			
			var tomax = that.getDayDiffObj(that.stayMax,dateObj);
			
			if(tomax>that.fromMaxVal)
			tomax = that.fromMaxVal;
			that.setToDateOption({
		
				"minDate":tomin,
				"maxDate":tomax,
				
			});
			
			that.storeDate(that.from);
			
			if(that.getToDate()=='' && selectedDate!='restore' && that.getFromDate()!='' && that.getFromDate()!=that.fromPlaceholder)
			{
				that.setDate(that.to,tomin);				
			}			

			if(that.fromOnSelect!='')
			{
				that.fromOnSelect (selectedDate);
			}
		}
		
		// store selected dates
		this.storeDate = function(id)
		{
			var time = '';
			var dateObj = that.getDateObj(id);
			
			if(this.useCookie==1)
			{
				if(dateObj!=null)
				{
					time = dateObj.getTime();
				}
				
				this.setCookie(id,time);
			}
			if(id==this.from)
			{
				if(dateObj!=null)
				{
					this.fromTime = dateObj.getTime();
					this.fromDay = dateObj.getDate();
					this.fromMonth = dateObj.getMonth();
					this.fromYear = dateObj.getFullYear();
					
					if(this.monthFormat==0)
					{
						this.fromMonth++;
					}
					
					if(this.fromDay.toString().length==1)
					this.fromDay = '0' + this.fromDay;
					
					if(this.fromMonth.toString().length==1)
					this.fromMonth = '0' + this.fromMonth;
					
					this.fromDate = this.fromYear + '-' + this.fromMonth + '-' + this.fromDay;					
				}
				else
				{
					this.fromTime = 0;
					this.fromDay = '';
					this.fromMonth = '';
					this.fromYear = '';
					this.fromDate = '';
				}
			}
			else
			{
				if(dateObj!=null)
				{
					this.toTime = dateObj.getTime();
					this.toDay = dateObj.getDate();
					this.toMonth = dateObj.getMonth();
					this.toYear = dateObj.getFullYear();
					
					if(this.monthFormat==0)
					{
						this.toMonth++;
					}
					
					if(this.toDay.toString().length==1)
					this.toDay = '0' + this.toDay;
					
					if(this.toMonth.toString().length==1)
					this.toMonth = '0' + this.toMonth;
					
					this.toDate = this.toYear + '-' + this.toMonth + '-' + this.toDay;		
				}
				else
				{
					this.toTime = 0;
					this.toDay = '';
					this.toMonth = '';
					this.toYear = '';
					this.toDate = '';
				}
			}
		}
		
		//restore selected dates
		this.restoreDate = function(id)
		{
			if(this.useCookie==1)
			{
				var selectedDate = this.getCookie(id);
				if(id==this.from && this.fromSelected==0 && selectedDate!='')
				{
					var dateObj = new Date(selectedDate);
					this.setDate(this.from,dateObj);
				}
				else if(id==this.to && this.toSelected==0 && selectedDate!='')
				{
					var dateObj = new Date(selectedDate);
					this.setDate(this.to,dateObj);
				}

			}
			
		}
		
		//to focus
		this.toFocus = function(e)
		{
			if(that.toOnFocus!='')
			{
				that.toOnFocus (e);
			}
		}
		
		//from focus
		this.fromFocus = function(e)
		{
			if(that.fromOnFocus!='')
			{
				that.fromOnFocus (e);
			}
		}
		
		//to blur
		this.toBlur = function(e)
		{
			//manual - entry reset
			that.manualEntry(that.to);
			
			if(that.toOnBlur!='')
			{
				that.toOnBlur (e);
			}
		}
		
		//from blur
		this.fromBlur = function(e)
		{
			//manual - entry reset
			that.manualEntry(that.from);
			
			if(that.fromOnBlur!='')
			{
				that.fromOnBlur (e);
			}
		}
		
		this.manualEntry = function(id)
		{
			if($('#ui-datepicker-div').css('display')=='none')
			{
				try
				{
					var dateObj = that.getDateObj(id);
					this.setDate(id,dateObj);
				}
				catch(e)
				{
					this.setDate(id,'');
				}
				
				if(id==that.from)
				{
					if(that.getFromDate()!='' && that.getFromDate()!=that.fromPlaceholder)
					{
						that.fromOnSelectFunc('');
					}
				}
				else
				{
					that.toOnSelectFunc('');
				}
				
			}
		}
		
		this.triggerEvents = function()
		{
			//to focus
			$('#' + this.to).focus(function(e){
				setTimeout(function(){
					that.toFocus(e);
				},300);
			
			});
			
			//from focus
			$('#' + this.from).focus(function(e){
				setTimeout(function(){
					that.fromFocus(e);
				},300);
			
			});
			
			//to blur
			$('#' + this.to).blur(function(e){
				setTimeout(function(){
					that.toBlur(e);
				},300);
			});
			
			//from blur
			$('#' + this.from).blur(function(e){
				setTimeout(function(){
					that.fromBlur(e);
				},300);
			});
		}
		
		
		// date highlight
		this.dateHighLight = function(date)
		{
			if($('#ui-datepicker-div-header').length==0)
			{
				var title = '';
				var hhtml = '';
				var fhtml = '';
				if($(this).attr('id')==that.from)
				{
					title = that.fromHeader;
					hhtml = that.fromHeaderHTML;
					fhtml = that.fromFooterHTML;
					var id = that.from;
				}
				else
				{
					title = that.toHeader;
					hhtml = that.toHeaderHTML;
					fhtml = that.toFooterHTML;
					var id = that.to;
				}
				
				$('#ui-datepicker-div').prepend('<div id="ui-datepicker-div-header" class="ui-datepicker-div-header">' + title + '<div id="ui-datepicker-div-close" class="ui-datepicker-div-close">x</div>' + hhtml + '</div>');
				$('#ui-datepicker-div-close').on('click',function(){
				
					$('#' + id).datepicker("hide");
					
				});
				if(that.showFooter==1)
				{
					setTimeout(function(){
					
						if($('#ui-datepicker-div-footer').length==0)
						{
							$('#ui-datepicker-div').append('<div id="ui-datepicker-div-footer" class="ui-datepicker-div-footer"><div id="ui-datepicker-div-reset" class="ui-datepicker-div-reset">' + that.resetCaption + '</div>' + fhtml + '</div>');
							
							if(that.showReset==1)
							{							
								$('#ui-datepicker-div-reset').on('click',function(){
									$('#' + that.from).val('');
									$('#' + that.to).val('');
									$('.dp-highlight').removeClass('dp-highlight');
									$('.ui-state-active').removeClass('ui-state-active');
									that.setCookie(that.from,'');
									that.setCookie(that.to,'');
									that.fromTime = 0;
									that.fromDay = '';
									that.fromMonth = '';
									that.fromYear = '';
									that.fromDate = '';
									that.toTime = 0;
									that.toDay = '';
									that.toMonth = '';
									that.toYear = '';
									that.toDate = '';
									
									if(that.onReset!='')
									{
										that.onReset (this);
									}
									
								});
							}
							else
							{
								$('#ui-datepicker-div-reset').remove();
							}
						}							
					});
				}
				
				
				
			}
			var fval = that.getFromDate();
			var tval = that.getToDate();		
			if(tval && fval && tval!=that.toPlaceholder && fval!=that.fromPlaceholder)
			{
				var date1 = that.getDateObj(that.from);
				var date2 = that.getDateObj(that.to);

				return [true, date >= date1 && date <= date2 ? "dp-highlight" : ""];
			}
			else
			{
				return [true, ""];
			}
		}
		
		//set date
		this.setDate = function(id,obj)
		{
			$( "#" + id).datepicker('setDate',obj);
			that.storeDate(id);
		}
		
		//set Option for to date
		this.setToDateOption = function(options)
		{
			$( "#" + this.to).datepicker('option',options);
		}
		
		//set Option for from date
		this.setFromDateOption = function(options)
		{
			$( "#" + this.from).datepicker('option',options);
		}
		
		//get from input box value
		this.getFromDate = function()
		{
			return $('#' + this.from).val();
		}
		
		//get to input box value
		this.getToDate = function()
		{			
			return $('#' + this.to).val();
		}
		
		//set Minimum maximum values
		this.setMinMax = function()
		{
			this.fromMinVal = this.getDayDiffObj(this.fromMin);		
			this.toMinVal = this.getDayDiffObj(this.toMin);		
			this.fromMaxVal = this.getDayDiffObj(this.fromMax);	
			this.toMaxVal = this.getDayDiffObj(this.toMax);		
		}	
		
		this.getDayDiffObj = function(days)
		{
			var today = new Date();
			
			if(arguments[1]!=undefined)
			today = arguments[1];
			
			var day = new Date(today);
				day.setDate(today.getDate() + days);
			return day;
		}
		
		this.getDateObj = function(id)
		{
			var dval = $( "#" + id).val();
			var disdateFormat = $.datepicker.regional[that.lang]["dateFormat"];
			var dateObj = $.datepicker.parseDate(disdateFormat, dval,$.datepicker.regional[that.lang]);
			return dateObj;
		}
		
		this.setCookie = function (key, val) 
		{
			var value = this.getrawCookie('date-range-picker');
			if(value==null)
			{
				value = {};				
			}
			else			
			{
				value = JSON.parse(value);
			}
			value[key] = val;
			value = JSON.stringify(value);
			var name = 'date-range-picker';
			var expdt = new Date();
			var expiry = new Date(expdt.getTime() + 30 * 24 * 3600 * 1000);
			document.cookie = name + "=" + escape(value) + "; path=/; expires=" + expiry.toGMTString();
        }
		
		this.getCookie = function(key)
		{
			var value = this.getrawCookie('date-range-picker');
			if(value!=null)
			{
				value = JSON.parse(value);
				var val = value[key];
			}
			if(val==undefined)
			{
				val = '';
			}
			return val;
		}
		
		this.getrawCookie = function (name)
		{
                var re = new RegExp(name + "=([^;]+)");
                var value = re.exec(document.cookie);
                return (value != null) ? unescape(value[1]) : null;
        }
		
		this.initialize = function(){
		
			that = this;
			if(this.lang=='auto')
			{
				this.findLang();
			}
			
			
			this.setMinMax();
			this.localeDateFormats();
			this.initializeDate();
			this.triggerEvents();
		
		}
		
		
		//find languages if there is no language passed
		this.findLang = function()
		{
			try
			{
				
				var lang = $('html').attr('lang');
				
				//lang = 'de';
				if(lang==null || lang==undefined  || lang=='' )
				{
					lang = 'en';
				}
				else
				{
					lang = lang.split('_');
					lang = lang[0];
					if(lang == 'en')
					{				
						lang = $('#locale').val();
						if(lang ==undefined || lang=='' || lang==null || lang.length<2)
						{
							lang = 'en';
						}
						else if(lang == 'gb/en')
						{
							lang = 'gb-en';
						}
					}
				}	
			
				if($.datepicker.regional[lang]==undefined || lang=='' || lang==null || lang.length<2)
				{
					lang = 'en';
				}	
			
				this.lang = lang;
			}
			catch(e)
			{
				this.lang = 'en';	
			}
		}
		
		// date formate for different locales
		this.localeDateFormats = function()
		{
			var lang = this.lang;
			this.MONTH_NAMES = $.datepicker.regional[lang]['monthNames'].concat($.datepicker.regional[lang]['monthNamesShort']);
			this.DAY_NAMES= $.datepicker.regional[lang]['dayNames'].concat($.datepicker.regional[lang]['dayNamesShort']);
			this.dateFormat = $.datepicker.regional[lang]['dateFormat'];
			this.locformdate = $.datepicker.regional[lang]['locformdate'];
			this.selectInCaption = $.datepicker.regional[lang]['selectInCaption'];
			this.selectOutCaption = $.datepicker.regional[lang]['selectOutCaption'];
			this.resetCaption = $.datepicker.regional[lang]['resetCaption'];
			this.availableCaption = $.datepicker.regional[lang]['availableCaption'];
			this.unavailableCaption = $.datepicker.regional[lang]['unavailableCaption'];
			this.selectedCaption = $.datepicker.regional[lang]['selectedCaption'];	
			
		}
	}
	catch(e)
	{
		//console.log(e);
	}
}