import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/portfolio_provider.dart';
import '../models/portfolio_item.dart';

class AdminScreen extends StatefulWidget {
  const AdminScreen({super.key});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {
  bool _isAuthenticated = false;
  final _passwordController = TextEditingController();
  final String _adminPassword = 'admin1234'; // Admin password

  @override
  void dispose() {
    _passwordController.dispose();
    super.dispose();
  }

  void _authenticate() {
    if (_passwordController.text == _adminPassword) {
      setState(() {
        _isAuthenticated = true;
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('비밀번호가 올바르지 않습니다.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_isAuthenticated) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('관리자 페이지'),
          centerTitle: true,
        ),
        body: Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.all(24),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.lock_outline, size: 64, color: Colors.blue),
                    const SizedBox(height: 24),
                    const Text(
                      '관리자 인증',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 24),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        labelText: '비밀번호',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.key),
                      ),
                      onSubmitted: (_) => _authenticate(),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _authenticate,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
                          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('로그인'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('관리자 페이지'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              setState(() {
                _isAuthenticated = false;
                _passwordController.clear();
              });
            },
            tooltip: '로그아웃',
          ),
        ],
      ),
      body: Consumer<PortfolioProvider>(
        builder: (context, provider, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Card(
                  color: Colors.blue.shade50,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        Icon(Icons.admin_panel_settings, size: 40, color: Colors.blue.shade700),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '포트폴리오 관리',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue.shade700,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '총 ${provider.portfolios.length}개의 프로젝트',
                                style: TextStyle(color: Colors.blue.shade600),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.add),
                          label: const Text('새 프로젝트 추가'),
                          onPressed: () => _showAddEditDialog(context, null),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Portfolio List
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: provider.portfolios.length,
                  itemBuilder: (context, index) {
                    final portfolio = provider.portfolios[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ExpansionTile(
                        leading: CircleAvatar(
                          backgroundColor: Colors.blue.shade100,
                          child: Text(
                            '${portfolio.order}',
                            style: TextStyle(
                              color: Colors.blue.shade700,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        title: Text(
                          portfolio.title,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(portfolio.subtitle),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit, color: Colors.blue),
                              onPressed: () => _showAddEditDialog(context, index),
                              tooltip: '편집',
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () => _showDeleteDialog(context, index),
                              tooltip: '삭제',
                            ),
                          ],
                        ),
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildInfoRow('설명', portfolio.description),
                                const SizedBox(height: 8),
                                _buildInfoRow('지원 언어', portfolio.languages.join(', ')),
                                const SizedBox(height: 8),
                                _buildInfoRow('이미지', '${portfolio.imageUrls.length}개'),
                                const SizedBox(height: 8),
                                _buildInfoRow('유튜브', '${portfolio.youtubeLinks.length}개'),
                                const SizedBox(height: 12),
                                const Text(
                                  '사이트맵:',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 4),
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade100,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    portfolio.siteMap,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontFamily: 'monospace',
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(
            '$label:',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        Expanded(
          child: Text(value),
        ),
      ],
    );
  }

  void _showAddEditDialog(BuildContext context, int? index) {
    final provider = Provider.of<PortfolioProvider>(context, listen: false);
    final isEdit = index != null;
    final portfolio = isEdit ? provider.portfolios[index] : null;

    final titleController = TextEditingController(text: portfolio?.title ?? '');
    final subtitleController = TextEditingController(text: portfolio?.subtitle ?? '');
    final descriptionController = TextEditingController(text: portfolio?.description ?? '');
    final siteMapController = TextEditingController(text: portfolio?.siteMap ?? '');
    final languagesController = TextEditingController(text: portfolio?.languages.join(', ') ?? '');
    final imageUrlsController = TextEditingController(text: portfolio?.imageUrls.join('\n') ?? '');
    final youtubeLinksController = TextEditingController(text: portfolio?.youtubeLinks.join('\n') ?? '');
    final orderController = TextEditingController(text: portfolio?.order.toString() ?? '${provider.portfolios.length + 1}');

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isEdit ? '프로젝트 편집' : '새 프로젝트 추가'),
        content: SingleChildScrollView(
          child: SizedBox(
            width: 600,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleController,
                  decoration: const InputDecoration(
                    labelText: '제목 *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: subtitleController,
                  decoration: const InputDecoration(
                    labelText: '부제목 *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: '설명 *',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 2,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: siteMapController,
                  decoration: const InputDecoration(
                    labelText: '사이트맵 *',
                    border: OutlineInputBorder(),
                    hintText: '사이트 구조를 입력하세요',
                  ),
                  maxLines: 8,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: languagesController,
                  decoration: const InputDecoration(
                    labelText: '지원 언어 (쉼표로 구분) *',
                    border: OutlineInputBorder(),
                    hintText: '한국어, 영어, 중국어',
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: imageUrlsController,
                  decoration: const InputDecoration(
                    labelText: '이미지 URL (한 줄에 하나씩)',
                    border: OutlineInputBorder(),
                    hintText: 'https://example.com/image1.jpg',
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: youtubeLinksController,
                  decoration: const InputDecoration(
                    labelText: '유튜브 링크 (한 줄에 하나씩)',
                    border: OutlineInputBorder(),
                    hintText: 'https://youtu.be/...',
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: orderController,
                  decoration: const InputDecoration(
                    labelText: '순서 *',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          ElevatedButton(
            onPressed: () {
              if (titleController.text.isEmpty ||
                  subtitleController.text.isEmpty ||
                  descriptionController.text.isEmpty ||
                  siteMapController.text.isEmpty ||
                  languagesController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('필수 항목을 모두 입력해주세요.')),
                );
                return;
              }

              final newPortfolio = PortfolioItem(
                id: portfolio?.id ?? 'portfolio_${DateTime.now().millisecondsSinceEpoch}',
                title: titleController.text,
                subtitle: subtitleController.text,
                description: descriptionController.text,
                siteMap: siteMapController.text,
                languages: languagesController.text.split(',').map((e) => e.trim()).toList(),
                imageUrls: imageUrlsController.text.isEmpty
                    ? []
                    : imageUrlsController.text.split('\n').where((e) => e.trim().isNotEmpty).toList(),
                youtubeLinks: youtubeLinksController.text.isEmpty
                    ? []
                    : youtubeLinksController.text.split('\n').where((e) => e.trim().isNotEmpty).toList(),
                order: int.tryParse(orderController.text) ?? 1,
              );

              if (isEdit) {
                provider.updatePortfolio(index, newPortfolio);
              } else {
                provider.addPortfolio(newPortfolio);
              }

              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(isEdit ? '프로젝트가 수정되었습니다.' : '프로젝트가 추가되었습니다.')),
              );
            },
            child: Text(isEdit ? '수정' : '추가'),
          ),
        ],
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, int index) {
    final provider = Provider.of<PortfolioProvider>(context, listen: false);
    final portfolio = provider.portfolios[index];

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('프로젝트 삭제'),
        content: Text('${portfolio.title} 프로젝트를 삭제하시겠습니까?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          ElevatedButton(
            onPressed: () {
              provider.deletePortfolio(index);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('프로젝트가 삭제되었습니다.')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('삭제'),
          ),
        ],
      ),
    );
  }
}
