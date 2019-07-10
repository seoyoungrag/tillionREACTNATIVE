
#import "RNAdBrix.h"

#import <React/RCTLog.h>
#import <AdSupport/AdSupport.h>
#import <AdBrixRM/AdBrixRM-Swift.h>

@implementation RNAdBrix

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(userRegist: (RCTResponseSenderBlock) callback)
{
    callback(@[[NSNull null], [NSNull null]]);
}
RCT_EXPORT_METHOD(registEvent:(NSString *)userId age:(NSString *)age gender:(NSString *)gender)
{
    RCTLogInfo(@"Pretending to create an event %@, %@, %@",userId, age,gender);
    AdBrixRM *adBrix = [AdBrixRM sharedInstance];
    
    NSDictionary *dict = @{@"userId":userId,
                            @"age":age,
                           @"gender":gender
                           };
    
    [adBrix commonSignUpWithChannel:AdBrixRmSignUpChannelAdBrixRmSignUpUserIdChannel commonAttr:dict];
}


@end
  
