exports.Phone_Number_Is_Duplicate = {
    statusCode: 409,
    code: 1000,
    message: 'شماره تلفن تکراری است'
};

exports.Pre_User_Undefined = {
    statusCode: 404,
    code: 1000,
    message: 'این شماره ثبت نام اولیه را انجام نداده است'
};

exports.Signing_Up_Failed = {
    statusCode: 500,
    code: 1001,
    message: 'ثبت نام موفقیت آمیز نبود. لطفا بعدا تلاش کنید'
};

exports.Joi_Errors = {
    statusCode: 422,
    code: 1002,
    message: 'داده ورودی نامعتبر است'
};

exports.Invalid_Verify_Code = {
    statusCode: 401,
    code: 1003,
    message: 'کد تایید نامعتبر است'
};

exports.Authentication_Failed = {
    statusCode: 500,
    code: 1004,
    message: 'احراز هویت موفقیت آمیز نبود'
};

exports.Invalid_Credentials = {
    statusCode: 401,
    code: 1005,
    message: 'مشخصات ورودی نامعتبر است. ورود ممکن نیست'
};

exports.Check_Credentials = {
    statusCode: 401,
    code: 1006,
    message: 'ورود ممکن نیست. لطفا مشخصات ورودی خود را چک کنید و دوباره تلاش کنید'
};

exports.Login_Failed = {
    statusCode: 500,
    code: 1007,
    message: 'ثبت نام موفقیت آمیز نبود. لطفا بعدا تلاش کنید'
};

exports.Bad_Request = {
    statusCode: 400,
    code: 1008,
    message: 'درخواست نامعتبر'
};

exports.Something_Went_Wrong = {
    statusCode: 500,
    code: 1009,
    message: 'اشتباهی در سرور رخ داد'
};

exports.Expiration_Verify_Code = {
    statusCode: 401,
    code: 1010,
    message: 'کد تایید منقضی شده است'
};

exports.Login_Failed = {
    statusCode: 500,
    code: 1011,
    message: 'ورود موفقیت آمیز نبود'
};

exports.User_Undefined = {
    statusCode: 404,
    code: 1013,
    message: 'کاربر  یافت نشد'
};

exports.Invalid_Token = {
    statusCode: 401,
    code: 1014,
    message: 'توکن ارسالی نامعتبر است'
};

exports.Reset_Forget_Password_Faild = {
    statusCode: 500,
    code: 1015,
    message: 'فرایند بروز رسانی پسورد امکان پذیر نیست'
};
exports.Access_Denied = {
    statusCode: 403,
    code: 1016,
    message: 'دسترسی به این آدرس امکان پذیر نیست'
};
exports.Wrong_Password = {
    statusCode: 401,
    code: 1017,
    message: 'رمز عبور نادرست است'
};
exports.Role_Undefined = {
    statusCode: 404,
    code: 1018,
    message: 'نقش پیدا نشد'
};
exports.Role_Is_Duplicate = {
    statusCode: 409,
    code: 1019,
    message: 'نقش تکراری است'
};
exports.Too_Many_Requests = {
    statusCode: 429,
    code: 1020,
    message: 'تعداد درخواست ها بیش از حد مجاز است'
};
exports.User_Is_Banned = {
    statusCode: 403,
    code: 1021,
    message: 'شما به مدت ۱۰ دقیقه از ادامه فعالیت منع شده اید'
};
exports.Access_Unfounded = {
    statusCode: 404,
    code: 1022,
    message: 'دسترسی پیدا نشد'
};
exports.Access_Is_Duplicated = {
    statusCode: 409,
    code: 1023,
    message: 'دسترسی تکراری است'
};
exports.Assignment_Is_Duplicated = {
    statusCode: 409,
    code: 1024,
    message: 'انتصاب تکراری است'
};
exports.Assignment_Unfounded = {
    statusCode: 404,
    code: 1025,
    message: 'انتصاب پیدا نشد'
};
exports.Existing_Active_Verification_Code = {
    statusCode: 400,
    code: 1026,
    message: 'در حال حاضر کد تایید فعالی وجود دارد'
};
exports.Wrong_Retry_New_Password = {
    statusCode: 406,
    code: 1027,
    message: 'تکرار رمز عبور نادرست است'
};
exports.Roadmap_Is_Duplicate = {
    statusCode: 409,
    code: 1028,
    message: 'نقشه راه تکراری است'
};
exports.Roadmap_Undefined = {
    statusCode: 404,
    code: 1029,
    message: 'نقشه راه تعریف نشده است'
};
exports.Course_Is_Duplicate = {
    statusCode: 409,
    code: 1030,
    message: 'دوره تکراری است'
};
exports.Course_Undefined = {
    statusCode: 404,
    code: 1031,
    message: 'دوره یافت نشد'
};
exports.Chapter_Undefined = {
    statusCode: 404,
    code: 1032,
    message: 'فصل یافت نشد'
};
exports.Unit_Undefined = {
    statusCode: 404,
    code: 1033,
    message: 'درس یافت نشد'
};
exports.Signup_In_Course_Failed = {
    statusCode: 500,
    code: 1034,
    message: 'ثبت نام در دوره با خطا مواجه شد. لطفا بعدا تلاش کنید'
};
exports.Expired_Change_Password_Time = {
    statusCode: 406,
    code: 1027,
    message: 'زمان تغییر رمز عبور تمام شده است.'
};
exports.Comment_Undefined = {
    statusCode: 404,
    code: 1031,
    message: 'نظر یافت نشد'
};
exports.Signup_Is_Duplicated = {
    statusCode: 409,
    code: 1030,
    message: 'ثبت نام تکراری است'
};
exports.Rate_Is_Duplicated = {
    statusCode: 409,
    code: 1030,
    message: 'شما پیش از قبل به این دوره امتیاز داده اید'
};
exports.Roadmap_Undeleted = {
    statusCode: 404,
    code: 1031,
    message: 'نقشه راه حذف نشده است'
};
exports.Token_Not_Exist = {
    statusCode: 401,
    code: 1032,
    message: 'توکن وارد نشده است'
};
exports.Token_Expired = {
    statusCode: 401,
    code: 1033,
    message: ' توکن منقضی شده است'
};
exports.Not_Delete_Admin_Role = {
    statusCode: 403,
    code: 1034,
    message: 'نقش ادمین را نمیتوان حذف کرد'
};
exports.Organizer_Is_Duplicate = {
    statusCode: 409,
    code: 1035,
    message: 'برگزارکننده تکراری است'
};
exports.Organizer_Undefined = {
    statusCode: 404,
    code: 1036,
    message: 'برگزارکننده یافت نشد'
};
exports.Unit_Is_Duplicate = {
    statusCode: 409,
    code: 1037,
    message: 'درس تکراری است'
};
exports.Banner_Undefined = {
    statusCode: 404,
    code: 1038,
    message: 'بنر بعریف نشده است'
};
exports.Exam_Is_Duplicate = {
    statusCode: 409,
    code: 1039,
    message: 'آزمون تکراری است'
};
exports.Exam_Undefined = {
    statusCode: 404,
    code: 1040,
    message: 'آزمون تعریف نشده است'
};
exports.Feedback_Rigestered = {
    statusCode: 404,
    code: 1041,
    message: 'نظر شما ثبت شده است'
};
exports.Certificate_Undefined = {
    statusCode: 404,
    code: 1042,
    message: 'گواهی ای با این شماره سریال وجود ندارد'
};
exports.signup_status_course = {
    statusCode: 404,
    code: 1043,
    message: 'کاربر در این دوره ثبت نام نکرده است'
};
exports.dislike_unit_question = {
    statusCode: 404,
    code: 1044,
    message: 'شما فقط یکبار می‌توانید دیسلایک کنید'
};
exports.like_unit_question = {
    statusCode: 404,
    code: 1045,
    message: 'شما فقط یکبار می‌توانید لایک کنید'
};
exports.Image_Max_Size = {
    statusCode: 400,
    code: 1046,
    message: 'سایز عکس باید کوچکتر از دو مگابایت باشد'
};
exports.Document_Max_Size = {
    statusCode: 400,
    code: 1047,
    message: 'سایز پی دی اف باید کوچکتر از ده مگابایت باشد'
};
exports.National_Id_Not_Valid = {
    statusCode: 422,
    code: 1048,
    message: 'کد ملی نامعتبر است'
};
exports.BootCamp_Undefined = {
    statusCode: 404,
    code: 1049,
    message: 'بوت کمپ تعریف نشده است'
};
exports.BootCamp_User_Not_Signuped = {
    statusCode: 404,
    code: 1050,
    message: 'ثبت نام اولیه برای کاربر انجام نشده است'
};
exports.Bootcamp_Signup_Not_Completed = {
    statusCode: 404,
    code: 1051,
    message: 'تمامی مراحل ثبت نام تکمیل نشده است'
};
exports.SMS_Service_Error = {
    statusCode: 503,
    code: 1052,
    message: 'سرویس ارسال پیامک از دسترس خارج است، لطفا بعدا تلاش کنید'
};
exports.Review_Undefined = {
    statusCode: 404,
    code: 1053,
    message: 'بازخورد تعریف نشده است'
};
exports.BootCamp_Title_Is_Duplicate = {
    statusCode: 409,
    code: 1054,
    message: 'عنوان تکراری است'
};
exports.User_Is_Exist_Destination_Bootcamp = {
    statusCode: 409,
    code: 1055,
    message: 'دانش آموزی با این اطلاعات در بوت کمپ که میخواهید انتقال دهید وجود دارد'
};
exports.Event_Undefined = {
    statusCode: 404,
    code: 1056,
    message: 'رویداد تعریف نشده است'
};
exports.Event_Not_Registered_User = {
    statusCode: 404,
    code: 1056,
    message: 'کاربر تاکنون در رویداد ثبت نام نکرده است'
};
exports.Event_Registered_User_Before = {
    statusCode: 409,
    code: 1057,
    message: 'کاربر در این رویداد ثبت نام کرده است'
};
exports.Event_Not_Registered_User_Before = {
    statusCode: 409,
    code: 1058,
    message: 'کاربر در این رویداد ثبت نام نکرده است'
};
exports.Event_Speaker_Not_Defined = {
    statusCode: 409,
    code: 1059,
    message: 'سخنرانی با این شناسه وجود ندارد'
};
exports.Event_Session_Not_Defined = {
    statusCode: 409,
    code: 1060,
    message: 'جلسه ای با این شناسه وجود ندارد'
};
exports.Gallery_Undefined = {
    statusCode: 404,
    code: 1061,
    message: 'گالری ای با این شناسه وجود ندارد'
};
exports.Day_Undefined = {
    statusCode: 404,
    code: 1062,
    message: 'روزی ای با این شناسه وجود ندارد'
};
exports.Session_Undefined = {
    statusCode: 404,
    code: 1063,
    message: 'جلسه ای با این شناسه وجود ندارد'
};
exports.Bootcamp_Committee_Member_Undefined = {
    statusCode: 404,
    code: 1064,
    message: 'عضوی با این شناسه در کمیته علمی این بوت کمپ وجود ندارد'
};
exports.Bootcamp_Committee_Member_Existing = {
    statusCode: 404,
    code: 1065,
    message: 'این کاربر از پیش عضو کمیته علمی این بوت کمپ بوده است'
};
exports.Homework_Undefined = {
    statusCode: 404,
    code: 1066,
    message: 'تکلیفی ای با این شناسه وجود ندارد'
};
exports.Not_Allowed_To_Upload = {
    statusCode: 403,
    code: 1067,
    message: 'قابلیت ارسال تکلیف وجود ندارد'
};
exports.Not_Allowed_To_Attend_Bootcamp = {
    statusCode: 403,
    code: 1068,
    message: 'این کاربر مجاز به شرکت در این دوره نمی باشد'
};
exports.Degree_Undefined = {
    statusCode: 404,
    code: 1066,
    message: 'تحصیلاتی با این شناسه وجود ندارد'
};
exports.Skill_Undefined = {
    statusCode: 404,
    code: 1067,
    message: 'مهارتی با این شناسه وجود ندارد'
};
exports.Skill_Duplicate = {
    statusCode: 404,
    code: 1068,
    message: 'مهارت از قبل اختصاص یافته است'
};
exports.Skill_Is_Max = {
    statusCode: 404,
    code: 1069,
    message: 'امکان اضافه کردن بیش از ۵ مهارت وجود ندارد'
};
exports.Profile_Undefined = {
    statusCode: 404,
    code: 1070,
    message: 'نمایه ای با این شناسه وجود ندارد'
};
exports.Existing_Homework = {
    statusCode: 404,
    code: 1071,
    message: 'تکلیف این جلسه از پیش بارگذاری شده است. لطفا تمرین ارسال شده را آپدیت کنید'
};
exports.Bootcamp_Committee_Image = {
    statusCode: 404,
    code: 1071,
    message: 'عکس عضو هیئت علمی آپلود نشده است'
};
exports.Gallery_Undefined = {
    statusCode: 404,
    code: 1066,
    message: 'این گالری تعریف نشده است'
};
exports.File_Not_Found = {
    statusCode: 404,
    code: 1067,
    message: 'این فایل پیدا نشده است'
};
exports.Folder_Not_Found = {
    statusCode: 404,
    code: 1068,
    message: 'این فولدر پیدا نشده است'
};
exports.No_Search_Query_Provided = {
    statusCode: 404,
    code: 1069,
    message: 'چیزی برای جست‌و‌جو وارد نشده است'
};
exports.Comment_Undefined = {
    statusCode: 404,
    code: 1070,
    message: 'نظری با این شناسه وجود ندارد'
};
exports.Comment_Update_Expired = {
    statusCode: 403,
    code: 1071,
    message: 'کامنت تنها تا یک ساعت بعد از ایجاد قابل ویرایش است'
};
exports.Comment_Liked_Before = {
    statusCode: 404,
    code: 1072,
    message: 'کامنت از پیش لایک شده است'
};
exports.Comment_Not_Liked_Before = {
    statusCode: 404,
    code: 1073,
    message: 'کامنت از پیش لایک نشده است'
};
exports.User_Signuped_Before = {
    statusCode: 404,
    code: 1074,
    message: 'این کاربر در این بوت کمپ وجود دارد'
};
exports.Acceptance_Status_Not_Entered = {
    statusCode: 404,
    code: 1075,
    message: 'وارد کردن وضعیت پذیرش در بوت کمپ الزامی است'
};
exports.User_Exists = {
    statusCode: 404,
    code: 1076,
    message: 'کاربر دیگری با این شماره تماس وجود دارد'
};
exports.SocialNetwork_Not_Found = {
    statusCode: 404,
    code: 1077,
    message: 'شبکه اجتماعی ای با این شناسه وجود ندارد'
};
exports.Question_Not_Found = {
    statusCode: 404,
    code: 1078,
    message: 'سوالی با این شناسه وجود ندارد'
};
exports.Option_Not_Found = {
    statusCode: 404,
    code: 1079,
    message: 'گزینه ای با این شناسه وجود ندارد'
};
exports.Participation_Exists = {
    statusCode: 404,
    code: 1080,
    message: 'آزمون را از قبل شروع کرده اید'
};
exports.Exam_Deadline_Passed = {
    statusCode: 404,
    code: 1081,
    message: 'مهلت شرکت در آزمون به پایان رسیده است'
};
exports.Participation_Not_found = {
    statusCode: 404,
    code: 1081,
    message: 'در این آزمون با این شناسه شرکت نشده است'
};
exports.Participation_Ended = {
    statusCode: 404,
    code: 1082,
    message: 'این آزمون را به اتمام رسانده اید'
};
exports.Item_Not_Found = {
    statusCode: 404,
    code: 1083,
    message: 'آیتمی با این شناسه وجود ندارد'
};
exports.Contact_Not_Found = {
    statusCode: 404,
    code: 1084,
    message: 'ارتباطی با این شناسه وجود ندارد'
};
exports.Route_Not_Found = {
    statusCode: 404,
    code: 1085,
    message: 'آدرس یافت نشد'
};
exports.Verfication_Code_Not_Exist = {
    statusCode: 404,
    code: 1086,
    message: 'کد نامعتبر است'
};
exports.Prerequisite_Undefined = {
    statusCode: 404,
    code: 1087,
    message: 'پیش نیاز تعریف نشده است'
};
exports.Template_Exists = {
    statusCode: 404,
    code: 1087,
    message: 'این کد از قبل استفاده شده است'
};
exports.Template_Undefined = {
    statusCode: 404,
    code: 1088,
    message: 'این قالب تعریف نشده است'
};
exports.Notification_Undefined = {
    statusCode: 404,
    code: 1089,
    message: 'این اعلان تعریف نشده است'
};
