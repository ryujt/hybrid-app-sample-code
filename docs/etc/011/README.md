# Flutter & Vue Javascript bridge

Flutter와 Vue를 이용해서 하이브리드 앱을 개발할 때
Javascript bridge를 이용해서 메시지를 주고 받는 과정을 설명합니다.


## Vue 파트

### App to Web (bridge-in.js)

``` js
import router from "@/router";

export default {
    init() {
        window.refresh = this.refresh;
        window.loadUrl = this.loadUrl;
    },

    refresh() {
        router.go();
    },

    loadUrl(url) {
        router.push({ path: window.atob(url) });
    },
}
```

### Web to App (bridge-out.js)

``` js
/* eslint-disable */

export default {
    /**
     * Web to App Globals sync
     * @param params 싱크할 데이터
     */
    syncGlobals(params) {
        const msg = {
            code: "syncGlobals",
            params: params
        };
        this.post(msg);
    },

    /**
     * 웹앱 초기화면 로딩이 완료된 것을 네이티브에게 알려준다.
     * 네이티브는 이 신호를 받으면 인트로 화면에서 웹뷰 화면으로 전환한다.
     */
    webViewReady() {
        const msg = {
            code: "webViewReady",
        };
        this.post(msg);
    },

    ...

    post(msg) {
        try {
            App.postMessage(JSON.stringify(msg));
        } catch (e) {
            console.log(msg);
            console.log(e);
        }
    },
};
```


## Flutter 파트

### App to Web (bridge.dart)

``` dart
class Bridge extends Core  {
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

  ...

  void _sendMessage(String functionName, String params) {
    Codec<String, String> stringToBase64 = utf8.fuse(base64);
    String encoded = stringToBase64.encode(params);

    _mainController?.runJavascript("$functionName('$encoded')");
    _subController?.runJavascript("$functionName('$encoded')");
  }
}
```

### Web to App (main.dart)

``` dart
...
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
        onReady: () {
          _init(context);
        },
        home: Bridge().getMainWebView(Config().HOME_URL));
  }

  void _init(BuildContext context) {
    Config().init();
    Globals().init(context);

    Bridge().subscribeEvent((event) async {
      print("${event.code} - ${jsonEncode(event.params)}");
      switch (event.code) {
        case 'webViewReady': // TODO: 스프래시 화면에서 메인화면 전환 등
        break;
      }
    });
  }
}
```