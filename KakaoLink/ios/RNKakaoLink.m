
#import "RNKakaoLink.h"

// 아래의 3개 항목을 import 해줍니다.
#import <React/RCTLog.h>

#import <KakaoLink/KakaoLink.h>
#import <KakaoMessageTemplate/KakaoMessageTemplate.h>

@implementation RNKakaoLink

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

// 이 함수를 추가해 주세요.
RCT_EXPORT_METHOD(link:(NSString *)title webUrl:(NSString *)webUrl mobileWebUrl:(NSString *)mobileWebUrl)
{
    KMTTemplate *template = [KMTFeedTemplate feedTemplateWithBuilderBlock:^(KMTFeedTemplateBuilder * _Nonnull feedTemplateBuilder) {
        
        // 콘텐츠
        feedTemplateBuilder.content = [KMTContentObject contentObjectWithBuilderBlock:^(KMTContentBuilder * _Nonnull contentBuilder) {
            contentBuilder.title = title;
            contentBuilder.imageURL = [NSURL URLWithString:@"http://k.kakaocdn.net/dn/0rt9g/btquuiyGpch/18etMXKHTQJG9syOHWqlL0/kakaolink40_original.png"];
            contentBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.webURL = [NSURL URLWithString:webUrl];
                linkBuilder.mobileWebURL = [NSURL URLWithString:mobileWebUrl];
            }];
        }];
        
        
        // 버튼
        [feedTemplateBuilder addButton:[KMTButtonObject buttonObjectWithBuilderBlock:^(KMTButtonBuilder * _Nonnull buttonBuilder) {
            buttonBuilder.title = @"보기";buttonBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
                linkBuilder.mobileWebURL = [NSURL URLWithString:mobileWebUrl];
                /*
                linkBuilder.iosExecutionParams = @"param1=value1&param2=value2";
                linkBuilder.androidExecutionParams = @"param1=value1&param2=value2";
                 */
            }];
             
        }]];
    }];
    
    [[KLKTalkLinkCenter sharedCenter] sendDefaultWithTemplate:template success:^(NSDictionary<NSString *,NSString *> * _Nullable warningMsg, NSDictionary<NSString *,NSString *> * _Nullable argumentMsg) {
        // 성공
        RCTLogInfo(@"warning message: %@", warningMsg);
        RCTLogInfo(@"argument message: %@", argumentMsg);
    } failure:^(NSError * _Nonnull error) {
        // 에러
        RCTLogInfo(@"error: %@", error);
    }];
}
@end
  
