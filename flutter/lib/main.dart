import 'package:flutter/material.dart';
import 'package:flutter_sample/config.dart';
import 'package:get/get_navigation/src/root/get_material_app.dart';

import 'core/bridge.dart';
import 'globals.dart';

void main() => runApp(MyApp());

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
