import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/data_service.dart';
import 'screens/home_screen.dart';
import 'screens/portfolio_detail_screen.dart';
import 'screens/company_info_screen.dart';
import 'screens/admin_screen.dart';
import 'providers/portfolio_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive database
  await DataService.initialize();
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => PortfolioProvider(),
      child: MaterialApp(
        title: 'Portfolio Manager',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.blue,
            brightness: Brightness.light,
          ),
          useMaterial3: true,
          cardTheme: CardThemeData(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => const HomeScreen(),
          '/portfolio-detail': (context) => const PortfolioDetailScreen(),
          '/company-info': (context) => const CompanyInfoScreen(),
          '/admin': (context) => const AdminScreen(),
        },
      ),
    );
  }
}
