	/**
	 * Created by PureDark on 2016/03/07.
	 * 用于简化服务端API调用的帮助类，对所有API调用进行了封装
	 */
	 
 	"use strict";
	var PLServerAPI = {
		login: function(cellphone, password, callback){
			var params = {
						module: "user",
						action: "login",
						cellphone: cellphone,
						password: password
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							callback.onSuccess(data);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		logout: function(callback){
			var params = {
						module: "user",
						action: "logout"
			};
			postNoReturnData(params, {
						onSuccess : function(){
							callback.onSuccess(null);
                        	window.location.href = "./login.html";
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		verifyCellphoneUnused: function(cellphone, callback){
			var params = {
						module: "user",
						action: "verifyCellphoneUnused",
						cellphone: cellphone
			};
			postNoReturnData(params, callback);
		},
		sendCaptcha: function(cellphone, callback){
			var params = {
						module: "user",
						action: "sendCaptcha",
						cellphone: cellphone
			};
			postReturnJsonElement(params, callback);
		},
		register: function(cellphone, password, captcha, callback){
			var params = {
						module: "user",
						action: "register",
						cellphone: cellphone,
						password: password,
						captcha: captcha
			};
			postNoReturnData(params, callback);
		},
		changePassword: function(oldpass, newpass, callback){
			var params = {
						module: "user",
						action: "changePassword",
						oldpass: oldpass,
						newpass: newpass
			};
			postNoReturnData(params, callback);
		},
		resetPassword: function(cellphone, password, captcha, callback){
			var params = {
						module: "user",
						action: "resetPassword",
						cellphone: cellphone,
						password: password,
						captcha: captcha
			};
			postNoReturnData(params, callback);
		},
		modifyUserInfo: function(nickname, sex, signature, birthday, callback){
			var params = {
						module: "user",
						action: "modifyUserInfo",
						nickname: nickname,
						sex: sex,
						signature: signature,
						birthday: birthday
			};
			postNoReturnData(params, callback);
		},
		getUserInfo: function(callback){
			var params = {
						module: "user",
						action: "getUserInfo"
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							
							var userInfo = 
								UserInfo.newInstance(data.uid, data.sex, data.nickname, data.signature, data.birthday);
							callback.onSuccess(userInfo);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		getUidByCellphone: function(cellphone, callback){
			var params = {
						module: "user",
						action: "getUidByCellphone",
						cellphone: cellphone
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							callback.onSuccess(data.uid);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		addBook: function(isbn13, cover, title, author, summary, callback){
			var params = {
						module: "library",
						action: "addBook",
						isbn13: isbn13,
						cover: cover,
						title: title,
						author: author,
						summary: summary
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var bid = data.bid;
							var book = BookListItem.newInstance(bid, isbn13, cover, title, author, summary);
							callback.onSuccess(book);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		deleteBook: function(bid, callback){
			var params = {
						module: "library",
						action: "deleteBook",
						bid: bid
			};
			postNoReturnData(params, callback);
		},
		addTag: function(bid, tag, callback){
			var params = {
						module: "library",
						action: "addTag",
						bid: bid,
						tag: tag
			};
			postNoReturnData(params, callback);
		},
		deleteTag: function(bid, tid, callback){
			var params = {
						module: "library",
						action: "deleteTag",
						bid: bid,
						tid: tid
			};
			postNoReturnData(params, callback);
		},
		getTagList: function(callback){
			var params = {
						module: "library",
						action: "getTagList"
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var tags = [];
							$.each(data, function(i, tag){
								tags[i] = Tag.newInstance(tag.tid, tag.title);
							});
							callback.onSuccess(tags);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		getBookList: function(uid, tids, keyword, callback){
			var params = {
						module: "library",
						action: "getBookList",
						uid: uid,
						tids: tids,
						keyword: keyword
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var books = [];
							$.each(data, function(i, book){
								books[i] = BookListItem.newInstance(book.bid, book.isbn13, book.cover, book.title, 
																	book.author, book.summary);
							});
							callback.onSuccess(books);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		addBorrowRecord: function(bid, loan_uid, callback){
			var params = {
						module: "borrow",
						action: "addBorrowRecord",
						bid: bid,
						loan_uid: loan_uid
			};
			postNoReturnData(params, callback);
		},
		acceptBorrowRecord: function(brid, accept, callback){
			var params = {
						module: "borrow",
						action: "acceptBorrowRecord",
						brid: brid,
						accept: (accept)?1:0
			};
			postNoReturnData(params, callback);
		},
		setBookReturned: function(brid, callback){
			var params = {
						module: "borrow",
						action: "setBookReturned",
						brid: brid
			};
			postNoReturnData(params, callback);
		},
		getBorrowedBookRecordList: function(status, callback){
			var params = {
						module: "borrow",
						action: "getBorrowedBookRecordList",
						status: status
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var borrowRecords = [];
							$.each(data, function(i, br){
								borrowRecords[i] = BorrowRecord.newInstance(br.brid, br.loan_uid, br.borrow_uid, 
									br.nickname, br.book_id , br.book_name, br.borrow_time, br.return_time, br.status);
							});
							callback.onSuccess(borrowRecords);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		getLoanedBookRecordList: function(status, callback){
			var params = {
						module: "borrow",
						action: "getLoanedBookRecordList",
						status: status
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var borrowRecords = [];
							$.each(data, function(i, br){
								borrowRecords[i] = BorrowRecord.newInstance(br.brid, br.loan_uid, br.borrow_uid, 
									br.nickname, br.book_id , br.book_name, br.borrow_time, br.return_time, br.status);
							});
							callback.onSuccess(borrowRecords);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		searchUser: function(keyword, callback){
			var params = {
						module: "social",
						action: "searchUser",
						keyword: keyword
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var friends = [];
							$.each(data, function(i, friend){
								friends[i] = Friend.newInstance(friend.uid, friend.sex, friend.nickname, 
													friend.signature, friend.birthday, friend.isFriend);
							});
							callback.onSuccess(friends);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		addRequest: function(fid, callback){
			var params = {
						module: "social",
						action: "addRequest",
						fid: fid
			};
			postNoReturnData(params, callback);
		},
		responseRequest: function(rid, accept, callback){
			var params = {
						module: "social",
						action: "responseRequest",
						rid: rid,
						accept: (accept)?1:0
			};
			postNoReturnData(params, callback);
		},
		deleteFriends: function(fid, callback){
			var params = {
						module: "social",
						action: "deleteFriends",
						fid: fid
			};
			postNoReturnData(params, callback);
		},
		getRequestList: function(page, callback){
			var params = {
						module: "social",
						action: "getRequestList",
						page: page
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var requests = [];
							$.each(data, function(i, req){
								requests[i] = Request.newInstance(req.rid, req.uid, req.nickname, req.status);
							});
							callback.onSuccess(requests);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		getFriendList: function(page, callback){
			var params = {
						module: "social",
						action: "getFriendList",
						page: page
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var friends = [];
							$.each(data, function(i, friend){
								friends[i] = Friend.newInstance(friend.uid, friend.sex, friend.nickname, 
													friend.signature, friend.birthday, friend.isFriend);
							});
							callback.onSuccess(friends);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		addBookMark: function(bid, title, content, callback){
			var params = {
						module: "social",
						action: "addBookMark",
						bid: bid,
						title: title,
						content: content
			};
			postNoReturnData(params, callback);
		},
		deleteBookMark: function(mid, callback){
			var params = {
						module: "social",
						action: "deleteBookMark",
						mid: mid
			};
			postNoReturnData(params, callback);
		},
		getBookMarkList: function(bid, uid, callback){
			var params = {
						module: "social",
						action: "getBookMarkList",
						bid: bid,
						uid: uid
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var bookMarks = [];
							$.each(data, function(i, bm){
								bookMarks[i] = BookMark.newInstance(bm.mid, bm.title, bm.summary, bm.content, bm.time, 
									bm.bid, bm.isbn13, bm.book_title, bm.book_cover, bm.uid, bm.nickname, bm.signature);
							});
							callback.onSuccess(bookMarks);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		getRecentBookMarks: function(uid, callback){
			var params = {
						module: "social",
						action: "getRecentBookMarks",
						uid: uid
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var bookMarks = [];
							$.each(data, function(i, bm){
								bookMarks[i] = BookMark.newInstance(bm.mid, bm.title, bm.summary, bm.content, bm.time, 
									bm.bid, bm.isbn13, bm.book_title, bm.book_cover, bm.uid, bm.nickname, bm.signature);
							});
							callback.onSuccess(bookMarks);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},
		getBookMarkDetails: function(mid, callback){
			var params = {
						module: "social",
						action: "getBookMarkDetails",
						mid: mid
			};
			postReturnJsonElement(params, {
						onSuccess : function(data){
							var bm = data;
							var bookMark = BookMark.newInstance(bm.mid, bm.title, bm.summary, bm.content, bm.time, 
									bm.bid, bm.isbn13, bm.book_title, bm.book_cover, bm.uid, bm.nickname, bm.signature);
							callback.onSuccess(bookMark);
						},
					  	onFailure : function(apiError){
							callback.onFailure(apiError);
						}
			});
		},

	};
	
	function postNoReturnData(params, callback){
		var baseUrl = "./servlet/manager";
		var myparams = {};
		$.each(params, function(key, value){
			if(value!==null&&value!="")
				myparams[key] = value;
		});
		$.ajax({
			 type: "POST",
			 url: baseUrl,
			 data: myparams,
			 dataType: "json",
			 success: function(result){
				 if(result.status){
					 callback.onSuccess();
				 }else{
					var errorCode = result.errorCode;
                    if (errorCode === 1002){
                        window.location.href = "./login.html";
					}else{
						callback.onFailure(ApiError.newInstance(errorCode));
					}
				 }
			},
			error:function(xhr){
				 callback.onFailure(ApiError.newInstance(1009));
			}
		});
	}
	
	function postReturnJsonElement(params, callback){
		var baseUrl = "./servlet/manager";
		var myparams = {};
		$.each(params, function(key, value){
			if(value!==null&&value!="")
				myparams[key] = value;
		});
		$.ajax({
			 type: "POST",
			 url: baseUrl,
			 data: myparams,
			 dataType: "json",
			 success: function(result){
				 if(result.status){
					 callback.onSuccess(result.data);
				 }else{
					var errorCode = result.errorCode;
                    if (errorCode === 1002){
                        window.location.href = "./login.html";
					}else{
						callback.onFailure(ApiError.newInstance(errorCode));
					}
				 }
			},
			error:function(xhr){
				 callback.onFailure(ApiError.newInstance(1009));
			}
		});
	}
