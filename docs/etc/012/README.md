# Flutter & Vue 데이터 동기화

Flutter와 Vue를 이용해서 하이브리드 앱을 개발할 때
데이터를 공유하는 방법에 대해서 설명합니다.

## 개요

> * App
>   * 기존의 데이터를 로컬 저장소에서 읽어와서 웹에게 알림
>   * Globals가 변경되면 웹에게 알림
>   * 데이터가 변동될 때마다 로컬 저장소에 백업
> * Web
>   * Globals가 변경되면 앱에게 알림
>   * 상태관리가 필요한 데이터만 store에 전달

데이터의 저장 및 복원은 앱에서 담당하고 웹은 앱의 데이터를 전달받아서 사용하는 형식입니다.

![](./pic-1.png)
* init
  * 앱이 실행되면 로컬 저장소에서 기존의 데이터를 가져옵니다.
* sendSyncData
  * syncGlobals 메시지를 Vue에게 전달합니다.
* globals.js - syncGlobals
  * 수신된 데이터를 Globals 모듈 내부에 저장합니다.
  * 상태관리가 필요한 데이터는 store에 전달합니다.
    * Main.js는 단순한 예입니다.
* mounted
  * Vue가 처음으로 로딩되면 webViewReady 메시지를 앱에게 전달합니다.
* webViewReady
  * 앱에 저장되어 있는 데이터를 sendSyncData를 통해서 웹에 전달합니다.
* changed
  * 웹과 앱의 Globals 모듈의 데이터가 변동되면 상대방에게 데이터를 전달하여 동기화 합니다.


## Vue 파트

``` js
import store from "@/store";
import bridgeOut from "@/bridge-out";

let syncData = {
    memberInfo: {},
};

export default {
    init() {
        window.syncGlobals = this.syncGlobals;
    },

    syncGlobals(params) {
        syncData = JSON.parse(window.atob(params));
        console.log(JSON.stringify(syncData));
        store.dispatch("main/setMemberInfo", syncData.memberInfo);
    },

    getData() {
        return syncData;
    },

    update() {
        bridgeOut.syncGlobals(syncData);
    },

    setMemberInfo(value) {
        syncData.memberInfo = value;
        store.dispatch("main/setMemberInfo", syncData.memberInfo);
        update();
    },
}
```
* 4-6: 앱과 동기화할 데이터입니다. 여기서는 memberInfo만 공유하는 것으로 가정하고 있습니다.
* 9-11: 초기화 코드입니다.
  앱에서 syncGlobals 메시지를 받으면 this.syncGlobals() 메소드를 호출하도록 합니다.
* 13-17: 앱에서 싱크할 데이터를 받으면 내부의 syncData 변수에 저장하는 역활을 합니다.
  14 라인에서 atob()를 이용해서 base64 디코딩해야 하는 것에 유의하세요.
* 23-25: 웹의 공유 데이터가 변하면 앱에게도 알려줘서 동기화하도록 합니다.
* 27-31: 사용자 정보인 memberInfo를 다루는 예제입니다.
  memberInfo의 경우에는 변경되면 UI에 바로 적용하기 위해서 상태관리를 하는 것으로 가정하고 있습니다.
  따라서 29 라인에 보시면 store의 main 모듈에 전달하는 것을 알 수 있습니다.


## Flutter 파트

``` dart
class Globals {
  static final Globals _instance = Globals._internal();

  factory Globals() {
    return _instance;
  }

  Globals._internal() {
    Bridge().subscribeEvent((event) async {
      switch (event.code) {
        case 'webViewReady': _webViewReady(); break;
        case 'syncGlobals': _syncGlobals(event); break;
      }
    });
  }

  void init(BuildContext context) async {
    ...
    _prefs = await SharedPreferences.getInstance();
    _syncData = jsonDecode(_prefs.getString('globals'));
    Bridge().syncGlobals(jsonEncode(_syncData));
  }

  void update() async {
    String json = jsonEncode(_syncData);
    Bridge().syncGlobals(json);
    _prefs.setString('globals', json);
  }

  Map<String, dynamic> getData() {
    return _syncData;
  }

  void _webViewReady() {
    Bridge().syncGlobals(jsonEncode(_syncData));
  }

  void _syncGlobals(EventData event) {
    _syncData = event.params;
  }

  var _prefs;
  var _syncData = <String, dynamic>{};
}
```
* 8-15: 초기화 코드입니다.
  Bridge 모듈의 이벤트를 구독해서
  webViewReady 메시지를 받으면 앱의 데이터를 웹에게 전달해주고,
  syncGlobals 메시지를 받으면 웹에서 받은 데이터를 앱의 정보에 덮어 쓰게 됩니다.
* 17-22: 외부에서 실행하는 초기화 코드입니다.
  8-15 라인의 코드를 여기서 함께 구현해도 문제는 없습니다.
* 19-21: 로컬 저장소에 백업된 공유 데이터를 가져오고 웹에게도 전달합니다.
* 24-28: 내부 데이터의 변동이 발생하면 웹에게 공유하고 로컬 저장소에도 백업을 합니다.