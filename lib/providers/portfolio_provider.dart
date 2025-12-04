import 'package:flutter/foundation.dart';
import '../models/portfolio_item.dart';
import '../models/company_info.dart';
import '../services/data_service_web.dart';

class PortfolioProvider extends ChangeNotifier {
  List<PortfolioItem> _portfolios = [];
  CompanyInfo? _companyInfo;

  List<PortfolioItem> get portfolios => _portfolios;
  CompanyInfo? get companyInfo => _companyInfo;

  PortfolioProvider() {
    _initialize();
  }

  Future<void> _initialize() async {
    // Wait for a moment to ensure DataServiceWeb is fully initialized
    await Future.delayed(const Duration(milliseconds: 100));
    await loadData();
  }

  Future<void> loadData() async {
    debugPrint('🔄 PortfolioProvider: Loading data...');
    
    try {
      _portfolios = DataServiceWeb.getAllPortfolios();
      _companyInfo = DataServiceWeb.getCompanyInfo();
      
      debugPrint('✅ PortfolioProvider: Loaded ${_portfolios.length} portfolios');
      
      if (_portfolios.isEmpty) {
        debugPrint('⚠️ PortfolioProvider: No portfolios found, may need initialization');
      }
      
      notifyListeners();
      debugPrint('✅ PortfolioProvider: Listeners notified');
    } catch (e) {
      debugPrint('❌ PortfolioProvider: Error loading data: $e');
    }
  }

  Future<void> addPortfolio(PortfolioItem item) async {
    debugPrint('➕ PortfolioProvider: Adding portfolio "${item.title}"');
    await DataServiceWeb.addPortfolio(item);
    _portfolios.add(item);
    _portfolios.sort((a, b) => a.order.compareTo(b.order));
    notifyListeners();
    debugPrint('✅ PortfolioProvider: Portfolio added and listeners notified');
  }

  Future<void> updatePortfolio(int index, PortfolioItem item) async {
    debugPrint('✏️ PortfolioProvider: Updating portfolio at index $index');
    await DataServiceWeb.updatePortfolio(index, item);
    if (index >= 0 && index < _portfolios.length) {
      _portfolios[index] = item;
      _portfolios.sort((a, b) => a.order.compareTo(b.order));
      notifyListeners();
      debugPrint('✅ PortfolioProvider: Portfolio updated and listeners notified');
    }
  }

  Future<void> deletePortfolio(int index) async {
    debugPrint('🗑️ PortfolioProvider: Deleting portfolio at index $index');
    await DataServiceWeb.deletePortfolio(index);
    if (index >= 0 && index < _portfolios.length) {
      _portfolios.removeAt(index);
      notifyListeners();
      debugPrint('✅ PortfolioProvider: Portfolio deleted and listeners notified');
    }
  }

  Future<void> updateCompanyInfo(CompanyInfo info) async {
    await DataServiceWeb.updateCompanyInfo(info);
    await loadData();
  }

  PortfolioItem? getPortfolioById(String id) {
    return DataServiceWeb.getPortfolioById(id);
  }
}
