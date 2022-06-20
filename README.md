# 하이브리드 형식의 프로젝트 샘플 코드

하이브리드 형식의 프로젝트에 대한 샘플코드입니다.
베리풀 개발을 통해서 얻은 결과물 중에 보편적으로 사용할 수 있는 코드를 분리 및 정리하였습니다.


## Flutter

### 폴더 및 파일 작성 규칙

하이브리드 형식의 프로젝트에 대한 규칙입니다. 최대한 api 호출과 UI 요소는 웹에서 처리하는 것을 원칙으로합니다.

![](./pic-1.png)
* api: Rest API 호출
* components: 라우터에 등록되지 않은 UI 요소
  * dialogs: dialog 콤포넌트
  * messages: 에러 또는 워닝 메시지 콤포넌트
* core: UI와 관련없이 순수 기능을 제공하는 모듈
  * 대표 클래스는 싱글톤으로 구현
  * 복잡한 경우 서브 폴더를 만들고 여러 개의 클래스로 나눠서 작업합니다. 이 때 서브 폴더는 대표 클래스 이름과 동일하게 작성합니다.
* data: 변경이 자주 일어나지 않는 데이터를 로컬로 저장해서 처리하고 싶을 때
* routes: 화면 네비게이션이 일어나는 경로 설정
* utils: 라이브러리 모음 (중복 코드 제거 등)
* views: 라우터에 등록되어 있는 UI 모듈
* config.dart: 서버 주소 등 설정 파일 (개발환경에 따라서 분리된 설정값을 제공)
* globals.dart
  * 로그인된 사용자 정보 등 앱 전체에서 접근이 필요한 데이터를 관리합니다.
  * 웹(Vue.js)의 globals와 동기화되도록 한다. 앱의 정보를 웹에게 전달하여 동기화하는 형식을 취합니다.
* messages.dart: 에러 등의 메시지를 코드로 관리합니다.


## Vue.js

### 폴더 및 파일 작성 규칙

![](./pic-2.png)
* api: Rest API 호출
* components: 라우터에 등록되지 않은 UI 요소
  * dialogs: dialog 콤포넌트
  * messages: 에러 또는 워닝 메시지 콤포넌트
* data: 변경이 자주 일어나지 않는 데이터를 로컬로 저장해서 처리하고 싶을 때
* routes: 화면 네비게이션이 일어나는 경로 설정
* store: 상태관리
* utils: 라이브러리 모음 (중복 코드 제거 등)
* views: 라우터에 등록되어 있는 UI 모듈
* globals.js
  * 웹 전체에서 접근이 필요한 데이터를 관리합니다.
  * 앱과 싱크되어야 하는 정보는 무조건 globals을 통해서 처리하도록 합니다.
  * 웹(Vue.js)의 globals와 동기화되도록 한다. 앱의 정보를 가져와서 사용하는 형식을 취합니다.
* messages.js: 에러 등의 메시지를 코드로 관리합니다.
* VueBase.js: 모든 뷰에 공통적으로 필요한 속성 및 기능을 정의하여 mixin 형태로 공유합니다.
* .env.*: 서버 주소 등 설정 파일 (개발환경에 따라서 분리된 설정값을 제공)

### 기본 패키지

``` json
"dependencies": {
    "axios": "^0.27.2",
    "core-js": "^3.8.3",
    "element-plus": "^2.2.6",
    "mitt": "^3.0.0",
    "swiper": "^8.2.4",
    "vue": "^3.2.13",
    "vue-router": "^4.0.3",
    "vuex": "^4.0.0"
},
```

::: warning
vuex-persistedstate 패키지는 더 이상 사용하지 않습니다.
영구 저장이 필요한 정보는 모두 app에서 처리하도록합니다.
:::


## Backend

### 에러 로그 API

프론트의 오류 수집을 위한 API 경로는 "/error/loging"로 통일하고 파라메터는 아래 코드를 참고합니다.

``` js
export default {
    sendMessage(code, msg) {
        let memberId = 0;
        try {
            memberId = globals.getMemberInfo().id;
        } catch (e) {
            console.log(e);
        }

        const request = {
            memberId: memberId,
            module: globals.getCurrentPath(),
            errorCode: code,
            errorMsg: msg
        };

        try {
            axios.post(process.env.VUE_APP_API_BASEURL + 'error/loging', request);
        } catch (e) {
            console.log(e);
        }
    }
}
```