const UserAgreementContent = () => (
  <div className="max-w-none text-slate-200">
    <h1 className="text-2xl font-bold text-blue-400 text-center mb-4">用户服务协议</h1>
    <p className="text-center text-slate-400 mb-8">更新日期：2026年07月05日</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">1. 协议的接受</h2>
    <p className="mb-3 text-slate-300 leading-relaxed">欢迎使用「多久算数」应用（以下简称「本应用」）。</p>
    <p className="mb-3 text-slate-300 leading-relaxed">本协议是您与深圳丰佰瑞网络科技有限公司（以下简称「我们」）之间关于使用本应用的法律协议。</p>
    <p className="mb-3 text-slate-300 leading-relaxed">通过下载、安装或使用本应用，您表示同意接受本协议的全部条款和条件。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">2. 服务内容</h2>
    <p className="mb-3 text-slate-300 leading-relaxed">本应用提供以下服务：</p>
    <ul className="list-disc pl-6 space-y-2 mb-4">
      <li className="text-slate-300 leading-relaxed">创建、编辑和管理纪念日（包含标题、日期、类型、图标、置顶等属性）</li>
      <li className="text-slate-300 leading-relaxed">正计时 / 倒计时计算：展示纪念日距今的天数、时分秒等时光跨度</li>
      <li className="text-slate-300 leading-relaxed">人生/恋爱/婚姻等场景化时光计算模块与自定义置顶</li>
      <li className="text-slate-300 leading-relaxed">纪念日海报生成、个性化水印与昵称配置</li>
      <li className="text-slate-300 leading-relaxed">多种主题样式与字体大小等个性化界面设置</li>
      <li className="text-slate-300 leading-relaxed">本地数据持久化存储与一键清空重置</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">3. 用户义务</h2>
    <p className="mb-3 text-slate-300 leading-relaxed">作为本应用的用户，您同意：</p>
    <ul className="list-disc pl-6 space-y-2 mb-4">
      <li className="text-slate-300 leading-relaxed">遵守本协议的所有条款以及中华人民共和国相关法律法规</li>
      <li className="text-slate-300 leading-relaxed">不使用本应用进行任何非法活动或传播违法违规内容</li>
      <li className="text-slate-300 leading-relaxed">不干扰、破坏本应用的正常运行，不对本应用进行反向工程、破解或恶意攻击</li>
      <li className="text-slate-300 leading-relaxed">保护您的设备安全，防止未授权访问您录入的纪念日与个人数据</li>
      <li className="text-slate-300 leading-relaxed">不得利用本应用侵犯他人合法权益（包括但不限于隐私权、名誉权、肖像权等）</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">4. 知识产权</h2>
    <p className="mb-3 text-slate-300 leading-relaxed">本应用的所有内容，包括但不限于文字、图像、音频、视频、软件、界面设计、LOGO、商标等，均受中华人民共和国知识产权法律保护。</p>
    <p className="mb-3 text-slate-300 leading-relaxed">未经我们的书面许可，您不得以任何形式复制、修改、分发、传播、展示或商业使用本应用的任何内容。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">5. 免责声明</h2>
    <p className="mb-3 text-slate-300 leading-relaxed">本应用按「原样」提供，在法律允许的最大范围内，不做任何形式的明示或默示保证。</p>
    <p className="mb-3 text-slate-300 leading-relaxed">我们不保证：</p>
    <ul className="list-disc pl-6 space-y-2 mb-4">
      <li className="text-slate-300 leading-relaxed">本应用将不间断、无中断、及时、安全或无错误地运行</li>
      <li className="text-slate-300 leading-relaxed">本应用的时光计算结果完全精确（部分场景涉及历法差异或时区边界，仅供参考）</li>
      <li className="text-slate-300 leading-relaxed">本应用将符合您的所有特定要求或预期</li>
    </ul>
    <p className="mb-3 text-slate-300 leading-relaxed">因您使用本应用所产生的任何直接或间接损失，我们仅在法律明确规定的范围内承担责任。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">6. 数据与本地存储</h2>
    <p className="mb-3 text-slate-300 leading-relaxed">本应用默认将您的纪念日、昵称、水印、设置等数据保存在设备本地存储（localStorage）中，不会主动上传至我们的服务器。</p>
    <p className="mb-3 text-slate-300 leading-relaxed">如您卸载应用、清除应用数据或在应用内触发「清空全部数据」，本地数据将被立即删除且不可恢复，请您自行做好重要数据的备份。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">7. 协议的修改与终止</h2>
    <p className="mb-3 text-slate-300 leading-relaxed">我们有权根据法律法规的更新或业务发展需要，对本协议进行修订。修订后的协议将在本应用内显著位置公示，并于更新之日起生效。</p>
    <p className="mb-3 text-slate-300 leading-relaxed">您也可以随时卸载本应用以停止使用本服务，协议的权利义务随之终止，但知识产权、免责声明等依其性质应当延续的条款仍然有效。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">8. 适用法律与争议解决</h2>
    <p className="mb-3 text-slate-300 leading-relaxed">本协议的订立、执行、解释及争议解决均适用中华人民共和国法律。</p>
    <p className="mb-3 text-slate-300 leading-relaxed">任何与本协议相关的争议，应首先通过友好协商解决；协商不成的，任何一方均有权提交至<strong>深圳市</strong>有管辖权的人民法院诉讼解决。</p>

    <div className="mt-10 pt-6 border-t border-white/10 text-center">
      <p className="mb-2 text-slate-400">感谢您阅读并同意《用户服务协议》</p>
      <p className="text-sm text-slate-500">© 2026 深圳丰佰瑞网络科技有限公司 版权所有</p>
    </div>
  </div>
);

export default UserAgreementContent;
