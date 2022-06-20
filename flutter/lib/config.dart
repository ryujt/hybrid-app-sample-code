import 'package:flutter/foundation.dart';

class Config {
  static final Config _instance = Config._internal();
  Config._internal();

  factory Config() {
    return _instance;
  }

  void init() {
    if (kDebugMode) {
      _setDebug();
    } else {
      _setRelease();
    }
  }

  String get HOME_URL => _HOME_URL;

  String _HOME_URL = "default site";

  void _setDebug() {
    _HOME_URL = "debug site";
  }

  void _setRelease() {
    _HOME_URL = "release site";
  }
}