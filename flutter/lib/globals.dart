import 'dart:convert';

import 'package:flutter/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/bridge.dart';

class Globals {
  static final Globals _instance = Globals._internal();

  factory Globals() {
    return _instance;
  }

  Globals._internal() {
    Bridge().subscribeEvent((event) async {
      print("${event.code} - ${jsonEncode(event.params)}");
      switch (event.code) {
        case 'webViewReady': _webViewReady(); break;
      }
    });
  }

  void init(BuildContext context) async {
    _screenWidth = context.size!.width;
    _screenHeight = context.size!.height;

    _prefs = await SharedPreferences.getInstance();
    _syncData = jsonDecode(_prefs.getString('globals'));
    Bridge().syncGlobals(jsonEncode(_syncData));
  }

  /**
   * Globals 정보가 변경되면 웹에 싱크하고 로컬 저장소에도 백업해 둔다.
   */
  void update() async {
    String json = jsonEncode(_syncData);
    Bridge().syncGlobals(json);
    _prefs.setString('globals', json);
  }

  Map<String, dynamic> getData() {
    return _syncData;
  }

  double getScreenWidth() {
    return _screenWidth;
  }

  double getScreenHeight() {
    return _screenHeight;
  }

  void _webViewReady() {
    Bridge().syncGlobals(jsonEncode(_syncData));
  }

  var _prefs;
  var _syncData = <String, dynamic>{};
  double _screenWidth = 0;
  double _screenHeight = 0;
}
