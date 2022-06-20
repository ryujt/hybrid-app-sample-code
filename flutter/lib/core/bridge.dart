import 'dart:convert';

import 'package:flutter_sample/core/events_data.dart';
import 'package:webview_flutter/webview_flutter.dart';

import 'core.dart';

class Bridge extends Core  {
  static final Bridge _instance = Bridge._internal();
  Bridge._internal();

  factory Bridge() {
    return _instance;
  }

  /**
   * App to Web Globals sync
   * @param params 싱크할 데이터
   */
  void syncGlobals(String params) {
    _sendMessage("syncGlobals", params);
  }

  /**
   * 페이지 새로고침
   */
  void refresh() {
    _sendMessage("refresh", "");
  }

  /**
   * 해당 주소로 웹뷰 이동
   */
  void loadUrl(String url) {
    _sendMessage("loadUrl", url);
  }

  /**
   * WebView 자바스크립트 브릿지가 적용된 메인 웹뷰를 생성하여 리턴한다.
   * @param url 초기에 로딩할 url
   * @return 메인 웹뷰 객체
   */
  WebView getMainWebView(String url) {
    _mainWebView ??= createWebView("main", url, _setMainController);
    return _mainWebView!;
  }

  /**
   * 메인 웹뷰의 컨트롤러를 리턴한다.
   * @return 메인 웹뷰의 컨트롤러 객체
   */
  WebViewController? getMainController() {
    return _mainController;
  }

  /**
   * 팝업이나 기타 용도로 추가 웹뷰가 필요할 때 사용한다.
   * @param url 초기에 로딩할 url
   * @return 메인 웹뷰 객체
   */
  WebView getSubWebView(String url) {
    _subWebView = createWebView("sub", url, _setSubController);
    return _subWebView!;
  }

  WebView createWebView(String id, String url, Function(WebViewController) setWebViewController) {
    return WebView(
      initialUrl: url,
      javascriptMode: JavascriptMode.unrestricted,
      onWebViewCreated: setWebViewController,
      onPageFinished: (String url) {
        fireCode("WebViewLoaded.$id");
      },
      onWebResourceError: (WebResourceError error){
        fireCode("WebViewError.$id");
      },
      javascriptChannels: <JavascriptChannel> {
        JavascriptChannel(
            name: 'App',
            onMessageReceived: (JavascriptMessage javascriptMessage) {
              Map<String, dynamic> params = jsonDecode(javascriptMessage.message);
              fireEvent(EventData(params['code'], params));
            }
        ),
      },
    );
  }

  void _setMainController(WebViewController webViewController) {
    _mainController = webViewController;
  }

  void _setSubController(WebViewController webViewController) {
    _subController = webViewController;
  }

  void _sendMessage(String functionName, String params) {
    Codec<String, String> stringToBase64 = utf8.fuse(base64);
    String encoded = stringToBase64.encode(params);

    _mainController?.runJavascript("$functionName('$encoded')");
    _subController?.runJavascript("$functionName('$encoded')");
  }

  WebView? _mainWebView;
  WebView? _subWebView;

  WebViewController? _mainController;
  WebViewController? _subController;
}