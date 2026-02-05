const fs = require('fs');
const path = require('path');

/**
 * 递归读取文件夹，返回树形结构
 * @param {string} dirPath 文件夹路径
 * @param {string} basePath 基准路径，用于生成相对 ID
 * @returns {Array} 树形结构数据
 */
function readDirectoryTree(dirPath, basePath = '') {
  if (!fs.existsSync(dirPath)) {
    console.error(`路径不存在: ${dirPath}`);
    return [];
  }

  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  const result = [];

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    const relativePath = basePath ? path.join(basePath, item.name) : item.name;

    if (item.isDirectory()) {
      // 文件夹
      result.push({
        title: item.name,
        id: item.name,
        children: readDirectoryTree(fullPath, relativePath)
      });
    } else {
      // 文件
      result.push({
        title: item.name,
        id: item.name
      });
    }
  }

  return result;
}

/**
 * 将树形数据写入指定文件
 * @param {string} sourceDir 要扫描的源文件夹
 * @param {string} outputFile 输出文件路径
 */
function generateAndSaveTreeData(sourceDir, outputFile) {
  console.log(`正在扫描文件夹: ${sourceDir}`);
  
  const treeData = readDirectoryTree(sourceDir);
  
  const data = treeData
  
  const jsonContent = `export default ` + JSON.stringify(data, null, 2);
  console.log(jsonContent)
  fs.writeFileSync(outputFile, jsonContent, 'utf8');
  console.log(`树形数据已写入: ${outputFile}`);
  console.log(`共处理 ${treeData.length} 个顶层项目`);
}

// 使用示例
if (require.main === module) {
  // 可自定义源文件夹和输出文件
  const sourceDirectory = './examples'; // 要扫描的文件夹
  const outputFilePath = './config/examples-config.js'; // 输出文件
  
  generateAndSaveTreeData(sourceDirectory, outputFilePath);
}
