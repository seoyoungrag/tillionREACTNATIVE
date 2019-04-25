
package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.kakao.kakaolink.v2.KakaoLinkService;
import com.kakao.kakaolink.v2.KakaoLinkResponse;
import com.kakao.message.template.FeedTemplate;
import com.kakao.message.template.LinkObject;
import com.kakao.message.template.ButtonObject;
import com.kakao.message.template.SocialObject;
import com.kakao.message.template.ContentObject;

import com.kakao.network.callback.ResponseCallback;
import com.kakao.network.ErrorResult;

import java.util.Map;
import java.util.HashMap;

public class RNKakaoLinkModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNKakaoLinkModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNKakaoLink";
  }

  
  // 아래 함수를 작성합니다.
  @ReactMethod
  public void link(String title,String webUrl,String mobileWebUrl) {
      FeedTemplate params = FeedTemplate
                  .newBuilder(ContentObject.newBuilder(title,
                  "http://k.kakaocdn.net/dn/0rt9g/btquuiyGpch/18etMXKHTQJG9syOHWqlL0/kakaolink40_original.png",
                  LinkObject.newBuilder().setWebUrl(webUrl)
                          .setMobileWebUrl(mobileWebUrl).build())
                  .build())
                  .addButton(new ButtonObject("보기", LinkObject.newBuilder()
                          .setWebUrl(webUrl)
                          .setMobileWebUrl(mobileWebUrl)
                          .setAndroidExecutionParams("key1=value1")
                          .setIosExecutionParams("key1=value1")
                          .build()))
                  .build();
      Map<String, String> serverCallbackArgs = new HashMap<String, String>();
      serverCallbackArgs.put("user_id", "${current_user_id}");
      serverCallbackArgs.put("product_id", "${shared_product_id}");
    
      KakaoLinkService.getInstance().
          sendDefault(this.getCurrentActivity(),
                      params, serverCallbackArgs,
                      new ResponseCallback<KakaoLinkResponse>() {
                          @Override
                          public void onFailure(ErrorResult errorResult) {
                              //successCallback.invoke(errorResult.toString());
                          }

                          @Override
                          public void onSuccess(KakaoLinkResponse result) {
                              //successCallback.invoke(result);
                          }
                      });
                      
  }
}