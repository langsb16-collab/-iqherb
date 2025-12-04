import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/data_service_web.dart';
import 'screens/home_screen.dart';
import 'screens/portfolio_detail_screen.dart';
import 'screens/company_info_screen.dart';
import 'screens/admin_screen.dart';
import 'screens/admin222_screen.dart';
import 'providers/portfolio_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize database - WEB ONLY (NO Hive, NO IndexedDB)
  try {
    debugPrint('🌐 Initializing DataServiceWeb (SharedPreferences only)');
    await DataServiceWeb.initialize();
    debugPrint('✅ DataServiceWeb initialized - NO Hive/IndexedDB');
    
    // Add delay to ensure data is ready
    await Future.delayed(const Duration(milliseconds: 500));
    debugPrint('✅ Data initialization complete');
  } catch (e) {
    debugPrint('⚠️ Database initialization failed: $e');
  }
  
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
        routes: {
          '/': (context) => const HomeScreen(),
          '/admin': (context) => const AdminScreen(),
          '/admin222': (context) => const Admin222Screen(),
          '/portfolio-detail': (context) => const PortfolioDetailScreen(),
          '/company-info': (context) => const CompanyInfoScreen(),
        },
      ),
    );
  }
}
