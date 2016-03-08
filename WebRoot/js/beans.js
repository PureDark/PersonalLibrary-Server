/**
 * Created by PureDark on 2016/03/07.
 * 用到的所有数据结构
 */

	var ApiError = {
		newInstance: function(errorCode){
			var apiError = {};
			apiError.errorCode = errorCode;
			
			var errorString;
			switch(errorCode){
				case 1000:errorString="未知错误";break;
				case 1001:errorString="参数不全";break;
				case 1002:errorString="尚未登录";break;
				case 1003:errorString="模块不存在";break;
				case 1004:errorString="没有权限";break;
				case 1005:errorString="json解析错误";break;
				case 1006:errorString="无此接口";break;
				case 1009:errorString="网络错误，请重试";break;
				case 1010:errorString="数据库错误";break;
				case 1011:errorString="密码错误";break;
				case 1012:errorString="用户不存在";break;
				case 1021:errorString="用户无此书";break;
				case 1022:errorString="书籍不存在";break;
				case 1023:errorString="Tag不存在";break;
				case 1032:errorString="手机号已被使用";break;
				case 1051:errorString="书评不属于该用户";break;
				case 1061:errorString="对方不拥有该书籍";break;
				case 1062:errorString="书籍已借出";break;
				case 1063:errorString="已经发送过借该书的请求";break;
				case 1064:errorString="无效的借书请求";break;
				default:errorString="未定义的错误码";break;
			}
			apiError.errorString = errorString;
			apiError.getErrorCode = function(){ return apiError.errorCode };
			apiError.getErrorMessage = function(){ return apiError.errorString };
			return apiError;
		}
	};
	
	var UserInfo = {
		newInstance: function(uid, sex, nickname, signature, birthday){
			var userInfo = {};
			userInfo.uid = uid;
			userInfo.sex = sex;
			userInfo.nickname = nickname;
			userInfo.signature = signature;
			userInfo.birthday = birthday;
			return userInfo;
		}
	};
	
	var BookListItem = {
		newInstance: function(bid, isbn13, cover, title, author, summary){
			var bookListItem = {};
			bookListItem.bid = bid;
			bookListItem.isbn13 = isbn13;
			bookListItem.cover = cover;
			bookListItem.title = title;
			bookListItem.author = author;
			bookListItem.summary = summary;
			return bookListItem;
		}
	};
	
	var Tag = {
		newInstance: function(tid, title){
			var tag = {};
			tag.tid = tid;
			tag.title = title;
			return tag;
		}
	};
	
	var BorrowRecord = {
		newInstance: function(brid, loan_uid, borrow_uid, nickname, book_id , book_name, borrow_time, return_time, status, isBorrowed){
			var borrowRecord = {};
			borrowRecord.brid = brid;
			borrowRecord.loan_uid = loan_uid;
			borrowRecord.borrow_uid = borrow_uid;
			borrowRecord.nickname = nickname;
			borrowRecord.book_id = book_id;
			borrowRecord.book_name = book_name;
			borrowRecord.borrow_time = borrow_time;
			borrowRecord.return_time = return_time;
			borrowRecord.status = status;
			borrowRecord.isBorrowed = isBorrowed;
			return borrowRecord;
		}
	};
	
	var Friend = {
		newInstance: function(uid, sex, nickname, signature, birthday, isFriend){
			var friend = {};
			friend.uid = uid;
			friend.sex = sex;
			friend.nickname = nickname;
			friend.signature = signature;
			friend.birthday = birthday;
			friend.isFriend = isFriend;
			return friend;
		}
	};
	
	var Request = {
		newInstance: function(rid, uid, nickname, status){
			var request = {};
			request.rid = rid;
			request.uid = uid;
			request.nickname = nickname;
			request.status = status;
			return request;
		}
	};
	
	var BookMark = {
		newInstance: function(mid, title, summary, content, time, bid, isbn13, book_title, book_cover, 
							uid, nickname, signature){
			var bookMark = {};
			bookMark.mid = mid;
			bookMark.title = title;
			bookMark.summary = summary;
			bookMark.content = content;
			bookMark.time = time;
			bookMark.bid = bid;
			bookMark.isbn13 = isbn13;
			bookMark.book_title = book_title;
			bookMark.book_cover = book_cover;
			bookMark.uid = uid;
			bookMark.nickname = nickname;
			bookMark.signature = signature;
			return bookMark;
		}
	};