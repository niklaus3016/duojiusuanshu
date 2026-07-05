const PrivacyPolicyContent = () => (
  <div className="max-w-none text-slate-200">
    <h1 className="text-2xl font-bold text-blue-400 text-center mb-2">🔒 隐私政策</h1>
    <p className="text-center text-slate-400 mb-6"><strong>生效日期</strong>：2026年07月05日</p>

    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl border-l-4 border-blue-400 mb-6">
      <p className="text-slate-300 leading-relaxed">欢迎使用「多久算数」（以下简称&quot;本应用&quot;）。本应用由<strong>深圳丰佰瑞网络科技有限公司</strong>（以下简称&quot;我们&quot;）开发并运营。我们深知个人信息对您的重要性，将严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。</p>
    </div>

    <p className="mb-6 text-slate-300 leading-relaxed">本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中提供的个人信息，以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">一、我们收集的信息</h2>
    <p className="mb-4 text-slate-300 leading-relaxed">在您使用本应用的过程中，我们会收集以下信息，以提供、维护和改进我们的服务：</p>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300 leading-relaxed"><strong>纪念日与时光记录数据</strong>：您在使用本应用过程中主动录入的所有<strong>纪念日标题、日期时间、事件类型、图标、置顶状态、昵称、自定义水印以及相关时光计算数据</strong>。这些数据是本应用的核心功能内容，用于为您提供纪念日记录、倒计时/正计时统计、人生/恋爱/婚姻时光计算和历史记录服务。</li>
      <li className="text-slate-300 leading-relaxed"><strong>应用偏好设置</strong>：您自定义的<strong>字体大小、主题样式、昵称、水印内容、模块置顶配置等偏好设置</strong>，用于持久化保存您的个性化界面与使用习惯。</li>
      <li className="text-slate-300 leading-relaxed"><strong>设备信息</strong>：为了保障应用的稳定运行和优化用户体验，我们会自动收集您的设备相关信息，包括但不限于<strong>设备型号、操作系统版本、设备标识符（如 Android ID）</strong>等。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">二、我们如何使用收集的信息</h2>
    <p className="mb-4 text-slate-300 leading-relaxed">我们仅会在以下合法、正当、必要的范围内使用您的个人信息：</p>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300 leading-relaxed"><strong>提供和改进服务</strong>：使用您的纪念日与时光数据来实现纪念日增删改查、时光跨度计算、海报画布生成与下载、历史记录等核心功能；通过分析设备信息和使用数据，优化应用性能，修复已知问题，提升用户体验。</li>
      <li className="text-slate-300 leading-relaxed"><strong>偏好持久化</strong>：将您的字体、主题、昵称、水印、模块置顶等偏好设置保存在本地，保证您每次打开应用都能恢复到熟悉的使用界面。</li>
      <li className="text-slate-300 leading-relaxed"><strong>数据分析和统计</strong>：在对您的个人信息进行匿名化或去标识化处理后，进行内部数据分析和统计，以了解用户群体的使用习惯和需求，从而更好地规划和改进产品功能。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">三、我们如何共享、转让和公开披露信息</h2>
    <p className="mb-4 text-slate-300 leading-relaxed">我们郑重承诺，严格保护您的个人信息，不会在以下情形之外向任何第三方共享、转让或公开披露您的信息：</p>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300 leading-relaxed"><strong>法定情形</strong>：根据法律法规的规定、行政或司法机关的强制性要求，我们可能会向有关部门披露您的相关信息。</li>
      <li className="text-slate-300 leading-relaxed"><strong>获得明确同意</strong>：在获得您的明确书面同意后，我们才会向第三方共享您的个人信息。</li>
      <li className="text-slate-300 leading-relaxed"><strong>业务必要且合规</strong>：为了实现本政策第二条所述的目的，我们可能会与提供技术支持或其他必要服务的合作伙伴共享必要的信息，但我们会要求其严格遵守本政策及相关法律法规，并对您的信息承担保密义务。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">四、我们如何存储和保护信息</h2>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300 leading-relaxed"><strong>存储地点和期限</strong>：您的纪念日与设置等个人信息默认存储于<strong>您的设备本地（localStorage）</strong>，不会主动上传服务器。如需云端同步等扩展服务，我们会另行告知并取得您的同意；我们会在实现本政策所述目的所必需的最短时间内保留您的信息，超出此期限后，我们将对您的信息进行删除或匿名化处理。</li>
      <li className="text-slate-300 leading-relaxed"><strong>安全措施</strong>：我们采用符合行业标准的技术手段和安全管理措施来保护您的个人信息，包括但不限于数据加密、访问控制、安全审计等，以防止信息泄露、丢失、篡改或被未经授权的访问。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">五、您的权利</h2>
    <p className="mb-4 text-slate-300 leading-relaxed">根据相关法律法规，您对您的个人信息享有以下权利：</p>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300 leading-relaxed"><strong>访问权</strong>：您可以随时在本应用的「纪念日」页面和「首页」查看和管理您录入的纪念日数据、时光数据以及相关历史记录。</li>
      <li className="text-slate-300 leading-relaxed"><strong>更正权</strong>：如您发现您的纪念日、时光或设置数据存在错误，您可以通过应用内的编辑功能进行修改和更正。</li>
      <li className="text-slate-300 leading-relaxed"><strong>删除权</strong>：您可以随时删除单条纪念日记录，或在「设置」页面点击清除全部数据，应用将立即从本地删除相关数据。</li>
      <li className="text-slate-300 leading-relaxed"><strong>数据导出</strong>：本应用所有数据存储在您的设备本地，您可以通过截屏、保存海报、设备备份等方式导出您的数据。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">六、未成年人保护</h2>
    <p className="mb-6 text-slate-300 leading-relaxed">我们非常重视对未成年人个人信息的保护。如您是未满14周岁的未成年人，在使用本应用前，应在监护人的指导下仔细阅读本政策，并征得监护人的同意。如我们发现自己在未事先获得监护人可验证同意的情况下收集了未成年人的个人信息，将立即删除相关数据。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">七、本政策的更新</h2>
    <p className="mb-6 text-slate-300 leading-relaxed">我们可能会根据法律法规的更新、业务的调整或技术的发展，适时对本隐私政策进行修订。修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您。如您继续使用本应用，即表示您同意接受修订后的政策。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-white">八、联系我们</h2>
    <p className="mb-4 text-slate-300 leading-relaxed">如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：</p>
    <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">
      <p className="mb-2 text-slate-300 leading-relaxed"><strong>运营主体</strong>：深圳丰佰瑞网络科技有限公司</p>
      <p className="mb-2 text-slate-300 leading-relaxed"><strong>电子邮箱</strong>：Jp112025@163.com</p>
    </div>

    <div className="mt-8 pt-6 border-t border-white/10 text-center">
      <p className="mb-2 text-slate-400">感谢您使用多久算数！</p>
      <p className="mb-4 text-slate-400">我们致力于为您提供纯净、浪漫的时光记录体验。</p>
      <p className="text-sm text-slate-500">© 2026 深圳丰佰瑞网络科技有限公司 版权所有</p>
    </div>
  </div>
);

export default PrivacyPolicyContent;
