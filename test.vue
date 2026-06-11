<template>
  <div>
    <div
      v-if="loginStatus"
      class="home"
      :class="{'home-main-nav': showMain}"
    >
      <!-- 头部 -->
      <div
        class="header"
        ref="header"
      >
        <div class="envTag" @click="envTagChange" v-if="getTagUrl">
          <img :src="getTagUrl"></img>
          <img class="envTag-shade" src="/static/image/home/hover_down.png"></img>
          <img src="/static/image/home/deleteIcon.png" @click="tagDelete"></img>
        </div>
        <div
          class="section"
          :style="bgStyle"
          :class="{navBg: isMouseOver}"
          @mouseover="isHover(true)"
          @mouseout="isHover(false)"
        >
          <!-- 菜单 -->
          <div class="nav" @click="closeDrawer">
            <div class="brand">
              <img
                :src="projectInfo.logo"
                alt=""
              >
            </div>
            <div class="nav-wrapper">
              <div
                v-if="loginStatus"
                class="all-nav"
                :class="{'active': showBar}"
                @mouseenter.prevent="showSideBar"
                @mouseleave.prevent="hideSideBar"
              >
                <div class="all-nav-btn"><i class="el-icon-mo-websiteNavigation"></i></div>
                <common-side-bar
                  class="side-menu-wrapper"
                  ref="sidebar"
                  :style="sideMenuWrapperStyle"
                >
                  <common-side-menu
                    :menus="Apps"
                    @menu-click="jumpAllNav"
                  ></common-side-menu>
                </common-side-bar>
              </div>
              <!-- <div v-show="projectInfo.show5th === 'Y'" class="5th-box" style="height: 100%;display: flex; align-items: center;margin: 0 20px 0 60px;">
                  <a href="https://www.56jzt.com/officialHome/#/5th"  target="_blank">
                    <img src="/static/image/officialHome/main/5th.png">
                  </a>
                </div> -->
              <div
                v-if="loginStatus"
                class="main-nav"
                @mouseleave="hideSubNav"
              >
                <ul v-dialogDrag.limit>
                  <li
                    v-for="(item, index) in Apps"
                    :key="index"
                    :class="{'active': item.active}"
                    v-show="item.children && item.children.length > 0"
                    draggable="false"
                  >
                    <div
                      @mouseenter="showSubNav(item)"
                      @mouseleave="toggleSubNav"
                      draggable="false"
                    ><a
                        href="javascript:;"
                        draggable="false"
                      >{{ item.Description }}</a></div>
                  </li>
                </ul>
                <div
                  class="sub-nav silideAnimate"
                  :class="animateClass"
                  style="height: calc(100vh - 97px); overflow: auto;"
                >
                  <common-waterfall
                    :menus="subMenus"
                    @menu-click="jumpMainNav"
                  ></common-waterfall>
                </div>
              </div>
            </div>
          </div>
          <!-- 头部右侧图标按钮 -->
          <div class="userInfo">
            <!-- <div class="search-container" v-if="loginStatus">
                <el-input v-model="keyword" :class="{'active': showSearch}"></el-input>
                <i class="el-icon-mo-websiteSearch" @click="onSearch"></i>
              </div> -->
            <div class="userAccount">
              <p  @click="closeDrawer"><i class="el-icon-mo-user"></i></p>
              <p
                v-if="!loginStatus"
                @click="checkLogin"
                class="login-btn"
              >登录</p>
              <el-dropdown v-if="loginStatus">
                <div>
                  <p v-if="operatorText" :style="!ldcText ? 'padding-right: 120px;' : ''" class="log-text" @click="closeDrawer">{{userName}}</p>
                  <p v-if="!operatorText" class="log-text1" @click="closeDrawer">{{userName}}</p>
                  <P v-if="ldcText" class="Ldc-text">,{{ldcText}}</P>
                  <p v-if="operatorText" class="Operator-text">{{operatorText}}</p>
                </div>
                <el-dropdown-menu slot="dropdown" @click="closeDrawer">
                  <el-dropdown-item
                    v-if="operatorName"
                    :title="operatorName"
                  ><span class="currentOperatorDp">当前信息：{{ operatorName }}</span></el-dropdown-item>
                  <el-dropdown-item
                    v-if="operatorId === '%' || operatorId.indexOf(',') !== -1 || ldcId === '%' || ldcId.indexOf(',') !== -1 || (operatorId.split(',').length === 1 && !ldcId)"
                    @click.native="openDialog('cOperator')"
                  >切换运营商</el-dropdown-item>
                  <el-dropdown-item @click.native="goModifyPwd">修改密码</el-dropdown-item>
                  <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <p v-if="loginStatus" @click="initSearchRouters"><i class="el-icon-search" style="cursor: pointer;font-size: 21px;"></i></p>
            </div>
            <div class="tool" @click="closeDrawer">
              <!-- <div
                class="quit"
                v-if="loginStatus"
                @click=""logOut
              ><i class="el-icon-mo-websiteQuit"></i></div> -->
              <!-- <div class="order"><a href="https://www.56jzt.com/officialHome/index.html#/home" target="_blank"><i class="el-icon-mo-websiteOrder"></i></a></div> -->
              <div
                class="refresh"
                @click="onRefresh"
              ><i class="el-icon-refresh"></i></div>
              <div
                v-show="projectInfo.showDuty === 'Y'"
                class="worker"
                v-if="loginStatus"
                style="position: relative"
                @mouseenter="showDropDown = true"
                @mouseleave="showDropDown = false"
              >
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  style="padding: 10px 0"
                >
                  <ul class="worker-info" @click="closeDrawer">
                    <li
                      v-if="duty.Staff_Id === Staff_Id"
                      style="text-align: center"
                    >
                      <el-button
                        type="danger"
                        size="mini"
                        @click="openDutySetting(1)"
                      >更换人员</el-button>
                    </li>
                    <li style="text-align: center">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="platinfoVisible = true"
                      >平台咨询</el-button>
                    </li>
                    <li style="text-align: center">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="getzbjh"
                      >值班计划</el-button>
                    </li>
                  </ul>
                  <i
                    slot="reference"
                    class="el-icon-phone-outline"
                    style="font-size: 20px; color: #fff"
                  ></i>
                </el-popover>
              </div>
              <!-- <a
                class="online-document"
                href="https://api.56jzt.com/doc/join-doc-manage/doc-wiki#/page/show?pageId=37"
                target="_blank"
              ><img
                  src="/static/image/home/question.png"
                  alt=""
                ></a> -->
              <!-- <div
                class="support"
                v-if="loginStatus"
              >
                <el-badge
                  :value="msgNum"
                  :max="99"
                  class="item"
                  :hidden="!msgNum"
                >
                  <a
                    href="https://www.56jzt.com#/support"
                    target="_blank"
                  >
                    <img src="/static/image/icons/support.png">
                  </a>
                </el-badge>
              </div> -->
              <!-- <div class="message"><i class="el-icon-mo-websiteNews"></i><span class="circle" v-show="msgNum">{{msgNum}}</span></div> -->
              <download></download>
              <div
                class="application"
                @mouseenter="openAppList"
                @mouseleave="closeAppList"
              >
                <i class="el-icon-mo-websiteApplication" style="margin-top: -3px;"></i>
                <span
                  class="circle"
                  v-if="appNum"
                >{{appNum}}</span>
                <ul
                  class="application-menu"
                  v-show="showAppList"
                >
                  <li
                    :class="{'home': item.widget === 'main', 'active': showIndex === index}"
                    v-for="(item, index) in widgets"
                    :key="index"
                    @click="toggleWidget(index, item)"
                  >
                    <a :title="item.name">{{item.name}}<i
                        class="close"
                        v-if="index !== 0"
                        @click.stop="deleteWidget(index)"
                      ></i></a>
                  </li>
                  <div
                    v-if="appNum >= 2"
                    class="bottom"
                  >
                    <div
                      title="全部关闭"
                      class="item"
                      @click="closeAll"
                    ><i class="el-icon-mo-deleteDuplicate"></i></div>
                    <div
                      title="关闭其他"
                      class="item"
                      @click="closeOther"
                    ><i class="el-icon-mo-deleteDocuments"></i></div>
                  </div>
                </ul>
              </div>
              <el-popover
                v-if="loginStatus"
                placement="bottom"
                trigger="hover"
                width="160"
                >
                <ul class="worker-info" @click="closeDrawer">
                    <li @click="onAddFeedBack">
                      新增反馈
                    </li>
                    <li @click="onPreviewFeedBack">
                      查看反馈列表
                    </li>
                  </ul>
                <div slot="reference" style="margin-right:20px;height:100%;">
                  <div style="display:flex;align-items: center;  height: 100%;">
                  <div style="display:flex;align-items: center; background-color: #fff;cursor: pointer;height:20px; overflow: hidden; border-radius: 5px;padding:3px 5px">
                    <!-- <i class="el-icon-document" style="color:#0a52AC"></i> -->
                     <span style="display: flex; width:13px;height:14px;margin-right:5px;padding-top:2px;">
                      <img  style="width:100%;"src="/static/image/icons/feedback.png" />
                     </span>
                    <span  style="color:#0751AC">反馈问题</span>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
      <!-- 主体内容 -->
      <div
        class="content-wrapper"
        @click="retractSearch"
      >
        <router-view
          v-if="curWidget.type === 'router'"
          v-show="!subpage.show"
        ></router-view>
        <div
          v-for="(item, index) in widgets"
          :key="item.id"
        >
          <common-frame
            @showFuncDtl="showFuncDtl"
            :page-name="pageName"
            ref="iframe"
            :top="headerHeight"
            :src="item.widget"
            :doc-url="item.pageInfo.docUrl"
            v-if="item.type === 'iframe'"
            v-show="!subpage.show && showIndex === index"
          ></common-frame>
        </div>
        <common-frame
          :sub="subpage.show"
          @subGoBack="jumpBack"
          :page-name="subpage.name"
          :top="headerHeight"
          :src="subpage.url"
          v-show="subpage.show"
        ></common-frame>
      </div>
      <el-dialog
        title="平台咨询"
        width="960px"
        :visible.sync="platinfoVisible"
      >
        <el-table :data="platInfo">
          <el-table-column
            label="平台名称"
            prop="platform"
            width="100px"
          ></el-table-column>
          <el-table-column
            label="平台OWNER"
            prop="name"
            width="120px"
          ></el-table-column>
          <el-table-column
            label="电话"
            prop="Mobilephone"
            width="150px"
          ></el-table-column>
          <el-table-column
            label="受理事务"
            prop="ownerDuties"
          ></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog
        title="更换值班人员"
        width="960px"
        :visible.sync="dutySettingVisible"
      >
        <el-table
          :data="dutyMembers"
          height="350px"
          @row-dblclick="changeDuty"
          :highlight-current-row="true"
          @current-change="currentChange"
        >
          <el-table-column
            label="姓名"
            prop="name"
          ></el-table-column>
          <!-- <el-table-column label="职员id" prop="Staff_Id" width="300px"></el-table-column> -->
          <el-table-column
            label="电话"
            prop="Mobilephone"
          ></el-table-column>
          <el-table-column
            label="qq"
            prop="Qq"
          ></el-table-column>
          <el-table-column
            label="微信"
            prop="Wechat"
          ></el-table-column>
        </el-table>
        <div slot="footer">
          <el-button
            type="primary"
            size="mini"
            @click="confirmDuty"
          >确认更换</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="changeTempMember"
          >更换临时人员</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="临时人员信息"
        :visible.sync="tempDutySettingVisible"
        :close-on-click-modal="false"
      >
        <el-form
          :inline="true"
          ref="tempMember"
          label-width="100px"
        >
          <el-form-item label="姓名">
            <el-input v-model="tempMember.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="tempMember.Mobilephone"></el-input>
          </el-form-item>
          <el-form-item label="qq">
            <el-input v-model="tempMember.Qq"></el-input>
          </el-form-item>
          <el-form-item label="微信">
            <el-input v-model="tempMember.Wechat"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="tempMember.Remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button
            type="primary"
            @click="changeDuty(tempMember)"
          >确定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="值班计划"
        width="80%"
        :visible.sync="showCalendar"
        :close-on-click-modal="false"
      >
        <div v-for="(item, index) in dutyplan" :key="index" class="dutyplan-content">
          <div class="dutyplan-title" @click="onExpandDuty(index, item.expand)">
            <div class="dutyplan-title__text">
              <div class="dutyplan-title__text--icon">
                <img src="/static/image/icons/area.png" v-if="item.name.includes('区域')"></img>
                <img src="/static/image/icons/duty.png"  v-if="item.name.includes('值班')"></img>
                <img src="/static/image/icons/emergency.png" v-if="item.name.includes('紧急')"></img>
                <img src="/static/image/icons/default.png" v-if="!item.name.includes('区域') && !item.name.includes('值班') && !item.name.includes('紧急')"></img>
              </div>
              {{ item.name }}
            </div>
            <div class="dutyplan-title__icon">
              <span style="font-weight: 200">{{ item.expand ? '收起' : '展开'}}</span>
              <i class="el-icon-arrow-down" v-if="!item.expand"></i>
              <i class="el-icon-arrow-up" v-if="item.expand"></i>
            </div>
          </div>
          <div v-if="item.expand">
            <el-table
              :data="item.children"
              highlight-current-row
              border
            >
            <el-table-column prop="name" label="人员" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="phone" label="电话" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="range" label="范围" min-width="400" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          </div>
        </div>
        <!-- <common-time-grid
          :start="startDate"
          :data="dutyplan"
          :show-date-toggle="false"
          :unshow-year="true"
          class="fixed"
        >
          <label slot-scope="scope">
            <span
              class="dutymb"
              style="font-size: 14px;cursor: pointer;"
              :class="{active: duty.Staff_Id === scope.detail.Staff_Id}"
              @click="changeDutyPlan(scope.detail)"
            >{{scope.detail.NAME}}</span>
          </label>
        </common-time-grid> -->
      </el-dialog>
    </div>
    <official-home v-else></official-home>
    <!-- 切换运营商弹框 -->
    <el-dialog
      title="切换运营商"
      :visible.sync="dialogShow.cOperator"
      width="400px"
    >
      <el-form
        :model="form"
        label-width="80px"
      >
        <el-form-item label="运营方">
          <el-input
            v-model="form.Operator_Name"
            placeholder="双击选择运营方"
            disabled
            @dblclick.native="openDialog('operator')"
          >
            <i
              slot="suffix"
              class="el-icon-close"
              @click="deleteOperator"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item label="物流中心">
          <el-input
            v-model="form.Ldc_Name"
            placeholder="双击选择物流中心"
            disabled
            @dblclick.native="openDialog('ldc')"
          >
            <i
              slot="suffix"
              class="el-icon-close"
              @click="deleteLdc"
            ></i>
          </el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogShow.cOperator = false">取 消</el-button>
        <el-button
          type="primary"
          @click="changeOperatorConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 运营方弹框 -->
    <operator-modal
      v-if="loginStatus"
      :visible.sync="dialogShow.operator"
      :isSetDefaultValue="false"
      :changeOperator="true"
      @change="selectOperator"
    ></operator-modal>
    <!-- 物流中心弹框 -->
    <ldc-modal
      v-if="loginStatus"
      ref="ldcModal"
      :visible.sync="dialogShow.ldc"
      :isCloud="true"
      :operatorId="form.Operator_Id"
      :strategy="true"
      @change="selectLdc"
    ></ldc-modal>
    <!-- 应用功能详情弹框 -->
    <el-dialog
      title="功能详情"
      :visible.sync="isShowFuncDtl"
      class="funcDtlDialog"
    >
      <el-table
        height="300px"
        border
        :data="dtlData"
        @cell-click="cellDblclickHandler"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50px"
        ></el-table-column>
        <el-table-column
          width="140px"
          label="变更时间"
          prop="change_time"
        ></el-table-column>
        <el-table-column
          label="变更人"
          prop="chang_person"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="需求提出方"
          prop="demand_proposer"
          width="120px"
        >
        </el-table-column>
        <el-table-column
          label="变更内容"
          prop="change_content"
        >
          <template slot-scope="scope">
            <div
              class="ql-editor"
              v-html="scope.row.change_content"
            ></div>
            <!-- <span class="change-content">{{scope.row.change_content}}</span> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 菜单搜索 -->
    <!-- <el-drawer
      title="我是标题"
      :visible.sync="true"
      direction="rtl"
      :before-close="handleClose">
      <span>我来啦!</span>
    </el-drawer> -->
    <div class="drawer" v-if="showDrawer">
      <div class="drawer-mask" @click="closeDrawer"></div>
      <div class="drawer-content" >
        <div class="drawer-content__search">
          <el-input v-model="routerKeyword" clearable placeholder="请输入页面名称/模块名称" @input="onSearchRouter" />
          <!-- @keyup.enter.native="onSearchRouter" -->
          <el-button type="text" @click="onSearchRouter">搜索</el-button>
        </div>
        <div id="drawerSearch" class="drawerSearch">
          <div v-if="lastView && localLink.length" class="drawer-content__lastcontent">
            <div class="drawer-content__last">最近访问</div>
            <div  class="drawer-content__list" v-for="(item, key) in localLink" :key="key" @click="jumpAllNav(item, 'storage')">
              <div class="drawer-content__list--title">{{ item.text }}</div>
              <div class="drawer-content__list--text">{{ item.appName ? `${item.appName}/` : '' }}{{ item.moduleName ? `${item.moduleName}/`: '' }}{{ item.text }}</div>
            </div>
          </div>
          <div v-if="searchList.length" id="list">
            <div  :class="item.attributes && item.attributes.url ?'drawer-content__list' : 'drawer-content__list disable'" v-for="(item, key) in searchList" :key="key" @click="item.attributes && item.attributes.url ?jumpAllNav(item) : () => {}">
              <div class="drawer-content__list--title" v-html="item.mainTitle"></div>
              <div class="drawer-content__list--text" v-html="item.subTitle"></div>
            </div>
          </div>
          <div  v-if="!searchList.length && !lastView" class="drawer-content__empty" id="empty">
            <div class="drawer-content__empty--content">
              <img src="/static/image/icons/empty.png" />
            </div>
            <!-- <i class="el-icon-news" style="font-size:100px"></i> -->
            <div>没有找到与{{routerKeyword}}相关的结果，请重新输入！</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="ZIY编码" :visible.sync="ziyVisible">
      <el-form :model="ziyForm"  ref="ziyRef" :rules="{ziyNo: [{ required: true, message: '请选择ZIY编码', trigger: 'blur' }]}">
        <el-form-item label="ZIY编码" prop="ziyNo">
          <el-select v-model="ziyForm.ziyNo" placeholder="请选择ZIY编码" style="width:100%">
            <el-option v-for="item in ziyData" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ziyVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmZiy">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import io from 'socket.io-client'
import axios from 'axios'
import commonSideMenu from '@/common/components/common-side-menu'
import commonSideBar from '@/common/components/common-side-bar'
import commonWaterfall from '@/common/components/common-waterfall'
import commonFrame from '@/common/components/common-frame'
import { Bus, Types } from '@/common/js/bus'
import officialHome from '@/officialHome/pages/index'
import Fetch from '@/websiteDesign/core/api'
import { getAppTopWindow } from '@/common/js/bom'
import qs from 'qs'
import Api from '@/common/js/api.js'
import { getIndexOfCollection, DateFtt } from '@/common/js/utils'
import { mapState } from 'vuex'
import operatorModal from '@/common/service/modal/operator-modal'
import ldcModal from '@/common/service/modal/ldc-modal'
import commonTimeGrid from '@/common/components/common-time-grid'
import 'viewerjs/dist/viewer.css'
import { directive as viewer } from 'v-viewer'
import download from '../components/download'
import dayjs from 'dayjs'
// import chineseHolidays  from 'chinese-holidays'
export default {
  name: 'home',
  props: [],
  directives: {
    viewer: viewer({
      debug: true
    })
  },
  components: {
    commonSideBar,
    commonSideMenu,
    commonWaterfall,
    commonFrame,
    officialHome,
    operatorModal,
    ldcModal,
    commonTimeGrid,
    download
  },
  data () {
    return {
      dtlData: [],
      currWidget: {},
      isShowFuncDtl: false,
      projectInfo: {
        showDuty: 'N',
        show5th: 'N',
        logo: ''
      },
      Staff_Id: Api.userInfo.Staff_Id,
      showDropDown: false,
      screenWidth: '',
      showSearch: false,
      keyword: '',
      search: { // 站内搜索
        type: '1'
      },
      chatSrc: 'http://10.3.87.33:3000/?Ticket=' + Api.userInfo.USERID,
      initChat: false, // 是否初始化聊天框
      showChat: false, // 是否显示聊天弹框
      showAppList: false, // 是否显示以打开页面列表
      searchClose: true, // 综合搜索框是否展开
      frames: [], // iframe集合
      showBar: false,
      Apps: [],
      headerHeight: 0,
      animateClass: 'slide-top-out',
      subMenus: [],
      mouse: {
        enter: null,
        leave: null,
        duration: 200
      },
      searchShow: false,
      // 鼠标悬停在顶部时候，显示主题色
      isMouseOver: false,
      subpage: {},
      duty: {
        name: '',
        Mobilephone: ''
      },
      dutyMembers: [],
      platInfo: [],
      platinfoVisible: false,
      dutySettingVisible: false,
      tempDutySettingVisible: false,
      tempMember: {
        name: '',
        Qq: '',
        Wechat: '',
        Mobilephone: '',
        Remark: ''
      },
      operatorId: Api.userInfo.Operator_Id,
      ldcId: Api.userInfo.Ldc_Id,
      operatorName: '',
      dialogShow: {
        cOperator: false,
        operator: false,
        ldc: false
      },
      form: {
        Ldc_Id: '',
        Ldc_Name: '',
        Ldc_ShortName: '',
        Ldc_No: '',
        Operator_Id: '',
        Operator_Name: '',
        Operator_No: '',
        dbflag: '',
        original_dbflag: Api.userInfo.dbflag
      },
      ldcText: '',
      operatorText: '',
      showCalendar: false,
      startDate: DateFtt('yyyy-MM-dd', new Date()),
      dutyplan: [],
      showDrawer: false, //搜索菜单抽屉
      routerKeyword: '',
      lastView: true, //最近访问
      routerList: [],
      searchList: [],
      localSearchList: [],
      localLink: [],
      ziyVisible: false,
      ziyData: [],
      ziyForm: {
        ziyNo: ''
      },
      ziyType: '',
      mainUrl: '',
      currentWidget: null
    }
  },
  computed: {
    ...mapState(['showMain', 'showIndex', 'widgets', 'loginStatus', 'chat', 'scrollTop', 'pageStatus', 'nationalOrderSearch', 'userName', 'support']),
    pageName () {
      if (this.showIndex > 0) {
        const widget = this.widgets[this.showIndex]
        this.currWidget = widget
        console.log(this.currWidget.id)
        return `${widget.appName} / ${widget.moduleName} / ${widget.name}`
      }
    },
    opacity () {
      return this.scrollTop / 280
    },
    bgStyle () {
      if (this.pageStatus === 0 && this.showMain) {
        return {
          backgroundColor: 'rgba(7, 81, 172, ' + this.opacity + ')'
        }
      } else {
        return {
          backgroundColor: 'rgba(7, 81, 172, 1)'
        }
      }
    },
    msgNum () {
      let rel = 0
      this.support.msgNumInfo.forEach(msg => {
        if (msg.num) {
          rel += msg.num
        }
      })
      return rel
    },
    curWidget () {
      return this.widgets[this.showIndex]
    },
    // 当前iframe索引
    curIframeIndex () {
      return this.widgets.slice(0, this.showIndex + 1).filter(item => item.type === 'iframe').length - 1
    },
    appNum () {
      return this.widgets.length - 1
    },
    // 侧边栏定位
    sideMenuWrapperStyle () {
      return {
        top: this.headerHeight + 'px'
      }
    },
    // 侧边栏菜单容器样式
    contentWrapperStyle () {
      return {
        paddingTop: this.headerHeight + 'px'
      }
    },
    getTagUrl() {
      switch (window.location.host) {
          // 开发环境
          case 'localhost:8070':
          case '10.3.87.222:8888':
          case 'jzyc-dev.56jzt.com':
              return '/static/image/home/envTag-dev.png'
          // 测试环境
          case '10.3.87.222':
          case 'jzyc-test.56jzt.com':
              return '/static/image/home/envTag-test.png'
          // 预生产环境
          case '10.24.16.242':
          case 'jzyc-pre.56jzt.com':
              return '/static/image/home/envTag-pre.png'
      }
    }
  },
  watch: {
    showIndex (val) {
      window.currentPage = this.widgets[val]
      if (window.currentPage.type !== 'router') {
        window.pageInfo = window.currentPage.pageInfo
      }
    }
  },
  methods: {
  initUlr() {
    if (window.location.origin.includes('https://jzyc-pre.56jzt.com')) { //预发布
      this.mainUrl = 'https://prealioth.56jzt.com'
    } else if (window.location.origin.includes('https://www.56jzt.com')) { //生产
      this.mainUrl = 'https://alioth.56jzt.com'
    } else { //测试
      this.mainUrl = 'http://10.3.87.222:9090'
    }
  },
   //新增反馈
  onAddFeedBack() {
    //1.获取token
    //2.获取ziy编码（单个直接调转，多个做弹窗绑定成功直接跳转，没有就提示）
    const token = this.getCookie('synergyAuthorization')
    this.ziyType = 'add'
    this.initUlr()
    if (!token) {
      this.getClientToken()
    } else {
      this.onCheckAndBindZiy()
    }
  },
  //查看反馈意见
  onPreviewFeedBack() {
    const token = this.getCookie('synergyAuthorization')
    this.ziyType = 'view'
    this.initUlr()
    if (!token) {
      this.getClientToken()
    } else {
      this.onCheckAndBindZiy()
    }
  },
  //获取协同平台token
  getClientToken() {
    axios.get(`${this.mainUrl}/zuul/admin/client/token?client_id=xlE8nC9nCcAZ3XOcDvwBEaWF&client_secret=YQDevqzDKErnMn3sTfPnjf6hPuNNiplG`).then(res => {
      const {data} = res
      if (data.data) {
        this.setCookie('synergyAuthorization', `${data.data.token_type.charAt(0).toUpperCase() + data.data.token_type.slice(1)} ${data.data.access_token}`, 1)
        this.onCheckAndBindZiy()
      } else {
        this.$alert(data.message)
      }
    })
  },
  //绑定ziy
  confirmZiy() {
    this.$refs.ziyRef.validate(valid => {
      if (valid) {
        let params = {
          ziyPhone: Api.userInfo.Mobilephone,
          ziyCode: this.ziyForm.ziyNo
        }
        const config = {
          headers: {
            Authorization: this.getCookie('synergyAuthorization'),
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }
        axios.post(`${this.mainUrl}/zuul/alioth/issue/ziyListBind`, params, config).then(res => {
        const {data} = res
        if (data.code === 200) {
          this.ziyVisible = false
          this.ziyData = []
            // const devURL = '10.3.87.222'
            if (this.ziyType === 'view') {
              window.open(`${this.mainUrl}/#/join-alioth-item/issueList?isFeedback=true&ziyPhone=${Api.userInfo.Mobilephone}&systemType=OMS`)
            } else {
              window.open(`${this.mainUrl}/#/join-alioth-item/createIssue?isFeedback=true&ziyPhone=${Api.userInfo.Mobilephone}&systemType=OMS`)
            }
        } else {
          this.$alert(data.message)
        }
      })
    }
  })
  },
  //获取ziy编码，单个就绑定，多个就弹窗选择然后绑定
  onCheckAndBindZiy() {
    const params = {
      ziyPhone: Api.userInfo.Mobilephone
    }
    const config = {
      headers: {
        Authorization: this.getCookie('synergyAuthorization'),
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    axios.post(`${this.mainUrl}/zuul/alioth/issue/checkAndBindZiy`, params, config).then(res => {
      const {data} = res
      if (data.code === 200) {
        if (data.data) {
          if (data.data.length > 1) {
            this.ziyVisible = true
            this.ziyData = data.data
          } else {
            if (this.ziyType === 'view') {
              window.open(`${this.mainUrl}/#/join-alioth-item/issueList?isFeedback=true&ziyPhone=${Api.userInfo.Mobilephone}&systemType=OMS`)
            } else {
              window.open(`${this.mainUrl}/#/join-alioth-item/createIssue?isFeedback=true&ziyPhone=${Api.userInfo.Mobilephone}&systemType=OMS`)
            }
          }
        } else {
          this.$alert('未查询到ziy编码')
        }
      } else {
        this.$alert(data.message)
      }
    })
  },
    //关闭搜索抽屉
    closeDrawer(e) {
      e.stopPropagation()
      this.showDrawer = false
    },
    //初始化搜索框数据
    initSearchRouters() {
      this.showDrawer = true
      //最近访问
      const localLinks =  localStorage.getItem('localLink2')
      if (localLinks) {
        this.localLink = JSON.parse(localLinks).slice(0, 10)
      }
      const totalList = []
      const list = [
    {
      id: '614832090005123072',
      text: '异常监控',
      menuCode: 'FYYCJK',
      state: 'open',
      iconCls: '',
      classId: 1,
      topId: '614832090005123072',
      children: [
        {
          appName: 'BMS计费管理',
          moduleName: '异常监控',
          ParentId: '614832090005123072',
          menuCode: 'FPGDYCZTJK',
          id: '613684240961515520',
          text: '发票勾兑异常状态监控',
          state: 'open',
          iconCls: '',
          attributes: {url: '../bms/marketization/index.html#/invoiceBlendSC'},
          classId: 2,
          AppId: '38',
          topId: '614832090005123072',
          docUrl: ''}]
    },
    {
      appName: 'REITs收入管理',
      moduleName: '合同资料',
      ParentId: '668134565742915585',
      menuCode: 'QYHWQFGZWH',
      id: '668815028732047360',
      text: '区域货位区分规则维护',
      state: 'open',
      iconCls: '',
      attributes:
       {url: '../jlp/reitManage/index.html#/regionalCargoDifferentiation'},
      classId: 2,
      AppId: '47',
      topId: '668134565742915585',
      docUrl: ''},
      {
      appName: 'REITs收入管理',
      moduleName: '过程数据维护',
      ParentId: '669282954744442880',
      menuCode: 'WTFHTBJDJ',
      id: '670550820806471680',
      text: '委托方合同报价.登记',
      state: 'open',
      iconCls: '',
      attributes: {url: '../jlp/reitManage/index.html#/regionalCargoDifferentiation'},
      classId: 2,
      AppId: '47',
      topId: '669282954744442880',
      docUrl: ''},
      {
      appName: 'REITs收入管理',
      moduleName: '过程数据维护',
      ParentId: '669282954744442880',
      menuCode: 'WTFHTBJDJ',
      id: '670550820806471680',
      text: '委托方合同登记',
      state: 'open',
      iconCls: '',
      attributes: '',
      classId: 2,
      AppId: '47',
      topId: '669282954744442880',
      docUrl: ''}
      ]
      // apps
      if (this.Apps && this.Apps.length && this.Apps.length > 1) {
        this.Apps.map(el => {
          if (el.children) {
            flatList(el.children)
          } else {
            totalList.push(el)
          }
        })
      } else {
        this.$alert('菜单加载未完成,请稍后重试')
        return
      }
        function flatList (rows) {
          if (rows.length) {
            rows.forEach((el) => {
              if (el.children) {
                flatList(el.children)
              } else {
                totalList.push(el)
              }
            })
          }
        }
        if (this.Apps && this.Apps.length && this.Apps.length > 1) {
          this.routerList = totalList
          //无需初始化列表数据（产品要求）
          this.searchList = []
          this.routerKeyword = ''
          this.lastView = true
        }
      // this.searchList = this.routerList.slice(0, 8)
    },
    //搜索路由关键字
    onSearchRouter(e) {
      this.lastView = false
      let keyWord =  this.routerKeyword.trim()
      // const reg = /[`~!@#$%^*()_+?:{},.\/;[\]]/
      // if (reg.test(keyWord)) {
      // console.error('正则匹配')
      //   this.searchList = []
      // }
      if (!keyWord) {
        this.lastView = true
        this.searchList = [] // this.routerList.slice(0, 10)
      } else {
        this.searchList = this.routerList.filter(el => {
          if (el.text && el.text.includes(keyWord)) {
            el.sortNo = 1
            return true
          } else if (el.moduleName && el.moduleName.includes(keyWord)) {
            el.sortNo = 2
            return true
          } else if (el.appName && el.appName.includes(keyWord)) {
            el.sortNo = 3
            return true
          } else {
            return false
          }
        })
      }
      const contentNode = document.getElementById('drawerSearch')
      if (this.searchList.length) {
        let highLight = keyWord
        // let replaceReg = new RegExp(highLight, 'g')
        let replaceString = `<span style="color:#0083FF;">${highLight}</span>`
        this.searchList = this.searchList.sort((a, b) => (a.sortNo - b.sortNo)).map(el => {
          const longStr = `${el.appName ? el.appName + '/' : ''}${el.moduleName ? el.moduleName + '/' : ''}${el.text}`
          console.error(el.text.replace(RegExp, replaceString), el.text)
          // replace(replaceReg, replaceString)
          return {
            ...el,
            mainTitle: el.attributes && el.attributes.url ? el.text.split(highLight).join(replaceString) : el.text,
            subTitle: el.attributes && el.attributes.url ? longStr.split(highLight).join(replaceString) : longStr
          }
        })
        // this.$nextTick(() => {
        //   if (contentNode && contentNode.innerHTML.includes(keyWord)) {
        //     // //清除上一次高亮显示
        //     Array.from(contentNode.querySelectorAll('span')).forEach(span => {
        //       if (span.firstChild) {
        //         span.parentNode.insertBefore(span.firstChild, span)
        //       }
        //         span.parentNode.removeChild(span)
        //     })
        //     console.log(contentNode, '测试')
        //     //添加文字高亮
        //     contentNode.innerHTML = contentNode.innerHTML.replaceAll(replaceReg, replaceString)
        //     console.log(contentNode, '测试')
        //   }
        // })
      }
    },
    cellDblclickHandler (row, column, cell, event) {
      const dom = event.target
      if (dom.nodeName === 'IMG') {
        window.open(dom.src, '_blank')
      }
    },
    async showFuncDtl () {
      //只有超级管理员可以查看
      if (Api.userInfo.RoleId.indexOf('31') === -1) {
        this.$alert('只有超级管理员可以点击查看')
        return
      }
      this.isShowFuncDtl = true
      const params = {
        Val: JSON.stringify({ fun_id: this.currWidget.id }),
        Id: 'AppFunctions',
        jztkey: '5466aae61b2f5c66022ae5fa3bf81517',
        UserId: Api.userInfo.UserId,
        UserName: Api.userInfo.UserName
      }
      const { Flag, MsgInfo, ErrInfo } = await Api.zuul('sessiondepots/servlet/GetAllListByFunction', params, 'get')
      if (Flag) {
        this.dtlData = MsgInfo
      } else {
        this.$alert(ErrInfo)
      }
    },

    // 打开弹框
    openDialog (val) {
      if (val === 'ldc' && !this.form.Operator_Id) {
        this.$alert('请先选择运营方！', '提示')
        return false
      }
      this.dialogShow[val] = true
      if (val === 'cOperator' && !this.operatorName) {
        let params = {
          Danw_Name: '%',
          StartIndex: 0,
          PageSize: 20
        }
        Api.get('JlpGetOperatorZl', params).then((res) => {
          if (res.MsgInfo.length === 1) {
            this.selectOperator(res.MsgInfo[0])
          }
        })
      }
    },
    // 选择运营商
    selectOperator (val) {
      this.form.Operator_Id = val.Operator_Id
      this.form.Operator_Name = val.Operator_Name
      this.form.Operator_No = val.Operator_No
      this.form.Ldc_Id = ''
      this.form.Ldc_Name = ''
      this.form.Ldc_ShortName = ''
      this.form.Ldc_No = ''
      // 获取运营商的dbflag
      this.getDbflagByOperator()
      this.$nextTick(() => {
        this.$refs.ldcModal.getLdc(false)
        // 2021.5.7 【ID1006997】运营商切换弹框：运营如果只有一个物流中心就自动带出
        this.$refs.ldcModal.promise.then(res => {
          if (res.Flag) {
            if (res.MsgInfo.length === 1) {
              this.selectLdc(res.MsgInfo[0])
            }
          }
        })
      })
    },
    // 删除运营商
    deleteOperator () {
      this.form.Operator_Id = ''
      this.form.Operator_Name = ''
      this.form.Operator_No = ''
      this.form.Ldc_Id = ''
      this.form.Ldc_No = ''
      this.form.Ldc_Name = ''
      this.form.Ldc_ShortName = ''
      Api.userInfo.dbflag = this.form.original_dbflag
    },
    // 选择物流中心
    selectLdc (val) {
      this.form.Ldc_Id = val.Ldc_Id
      this.form.Ldc_Name = val.Ldc_Name
      this.form.Ldc_ShortName = val.Ldc_ShortName
      this.form.Ldc_No = val.Ldc_No
      Api.userInfo.Address_Id = val.Address_Id
    },
    // 删除物流中心
    deleteLdc () {
      this.form.Ldc_Id = ''
      this.form.Ldc_Name = ''
      this.form.Ldc_No = ''
      this.form.Ldc_ShortName = ''
    },
    // 切换运营商确认
    changeOperatorConfirm () {
      const oldOperator_Id = Api.userInfo.Operator_Id
      const oldLdc_Id = Api.userInfo.Ldc_Id
      if (this.form.Operator_Id) {
        Api.userInfo.Operator_Id = this.form.Operator_Id
        Api.userInfo.Operator_Name = this.form.Operator_Name
        Api.userInfo.Operator_No = this.form.Operator_No
        this.operatorName = Api.userInfo.Operator_Name + ' ' + this.form.Operator_No + ' ' +  ' ; ' + ' ' + this.form.Ldc_ShortName + ' ' + this.form.Ldc_No
        this.operatorText = this.form.Operator_Name
        this.ldcText = this.form.Ldc_ShortName
        Api.userInfo.dbflag = this.form.dbflag
      } else {
        Api.userInfo.Operator_Id = Api.userInfo.Origin_Operator_Id
        Api.userInfo.Operator_Name = ''
        Api.userInfo.Operator_No = ''
        this.operatorName = ''
        Api.userInfo.dbflag = this.form.original_dbflag
        Api.userInfo.Address_Id = ''
      }
      if (this.form.Ldc_Id) {
        Api.userInfo.Ldc_Id = this.form.Ldc_Id
        Api.userInfo.Ldc_Name = this.form.Ldc_Name
        Api.userInfo.Ldc_No = this.form.Ldc_No
      } else {
        Api.userInfo.Ldc_Id = Api.userInfo.Origin_Ldc_Id
        Api.userInfo.Ldc_No = ''
      }
      this.dialogShow.cOperator = false
      // 设置dbflag cookie
      this.setCookie('dbflag', Api.userInfo.dbflag)
      if (this.$store.state.widgets.length > 1 && oldOperator_Id !== Api.userInfo.Operator_Id && oldLdc_Id !== Api.userInfo.Ldc_Id) {
        this.$message({
          message: '为了确保安全，系统将自动关闭其他已打开的页面！',
          type: 'warning',
          duration: 1500
        })
        this.closeOther()
        setTimeout(() => {
          this.onRefresh()
        }, 1500)
      }
    },
    // 获取运营商的dbflag
    getDbflagByOperator () {
      let params = {
        Operator_Id: this.form.Operator_Id
      }
        Api.get('ds_comm_getdbflag', params).then(res => {
          if (res.Flag) {
            if (res.MsgInfo.length > 0) {
              this.form.dbflag = res.MsgInfo[0].dbflag
            } else {
              this.form.dbflag = ''
            }
          } else {
            this.$alert(res.ErrInfo, '提示')
          }
      })
    },
    openAppList () {
      this.$nextTick(() => {
        this.showAppList = true
      })
    },
    closeAppList () {
      this.$nextTick(() => {
        this.showAppList = false
      })
    },
    goModifyPwd () {
      this.$store.commit('toggleWidget', 0)
      this.$router.push({
        name: 'modifyPwd'
      })
    },
    viewMsg () {
      this.$store.commit('toggleWidget', 0)
      this.$router.push({
        name: 'chat'
      })
    },
    retractSearch () {
      this.keyword = ''
      this.showSearch = false
    },
    onSearch () {
      if (!this.showSearch) {
        this.showSearch = true
        return false
      }
      if (!this.loginStatus) {
        this.goLogin()
        return false
      }
      if (this.keyword === '') {
        this.$alert('请输入关键字搜索')
        return false
      }
      this.$store.commit('setNationalOrderSearch', this.keyword)
      this.searchClose = true
      this.$store.commit('toggleWidget', 0)
      this.$router.push({
        name: 'waybill'
      })
    },
    goWayBill () {
      this.$store.commit('toggleWidget', 0)
      this.$router.push({
        name: 'waybill'
      })
    },
    onRefresh () {
    console.error('刷新吗===')
      if (this.curWidget.type === 'router') { // 路由类型刷新
        location.reload()
      } else {
        this.$refs['iframe'][this.curIframeIndex].reload()
      }
    },
    // 关闭所有
    closeAll () {
      this.$store.commit('closeAll')
      this.showAppList = false
    },
    // 关闭其他
    closeOther () {
      this.$store.commit('closeOther', this.showIndex)
      this.showAppList = false
    },
    checkLogin () {
      if (!this.loginStatus) {
        this.goLogin()
      }
    },
    beforeCommit (obj) {
      if (obj.type === 'router') {
        this.$router.push({
          name: obj.widget
        })
      }
    },
    toggleWidget (i, item) {
      // 20181206 huxiangli
      this.jumpBack()
      this.currentWidget = item
      // end
      if (i === 0) {
        this.$store.commit('toggleMain', true)
        Bus.$emit(Types.resetTop)
      } else {
        this.$store.commit('toggleMain', false)
      }
      this.beforeCommit(item)
      this.$store.commit('toggleWidget', i)
      this.showAppList = false
    },
    deleteWidget (i) {
      const obj = this.$store.state.widgets[i]
      if (this.currentWidget && obj.id === this.currentWidget.id) {
        this.currentWidget = i > 0 ? this.$store.state.widgets[i - 1] : this.$store.state.widgets[0]
      }
      this.$store.commit('deleteWidget', i)
    },
    // 退出
    logOut () {
      this.$confirm('确定退出当前账户吗？')
        .then(() => {
          this.searchClose = true
          let userId = this.getCookie('userId')
          if (!userId) {
            this.$store.commit('setLoginStatus', false)
            this.$store.commit('closeAll')
          } else {
            Api.zuul('logout').then(flag => {
              if (flag) {
                this.clearCookie('userId')
                this.clearCookie('access_token')
                this.clearCookie('dbflag')
                this.$store.commit('setLoginStatus', false)
                this.$store.commit('closeAll')
              }
            })
          }
        })
    },
    // 侧边栏显示
    showSideBar () {
      clearTimeout(this.mouse.leave)
      this.mouse.enter = setTimeout(() => {
        this.$refs.sidebar.show()
        this.showBar = true
      }, this.mouse.duration)
    },
    // 侧边栏隐藏
    hideSideBar () {
      clearTimeout(this.mouse.enter)
      this.mouse.leave = setTimeout(() => {
        this.$refs.sidebar.hide()
        this.showBar = false
      }, this.mouse.duration)
    },
    // 显示顶部菜单
    showSubNav (obj) {
      this.mouse.enter = setTimeout(() => {
        this.Apps.forEach(item => {
          item.active = false
        })
        this.animateClass = 'slide-top-in'
        obj.active = true
        this.subMenus = obj.children
      }, this.mouse.duration)
    },
    // 顶部菜单迟缓显示
    toggleSubNav () {
      clearTimeout(this.mouse.enter)
    },
    // 顶部菜单收起
    hideSubNav () {
      this.animateClass = 'slide-top-out'
      this.Apps.forEach(item => {
        item.active = false
      })
    },
    // 获取某一模块菜单（业务平台、配送平台）
    getMenuList (app) {
      let params = {
        UserId: Api.userInfo.USERID,
        APPID: app.AppId
      }
      Api.get('DS_TMP_MENULIST', params, true)
        .then(res => {
          if (res.Flag) {
            app.children = this.toTreeData(res.MsgInfo.map(l => {
              l.appName = app.Description
              return l
            }))
          } else {
            this.$alert(res.ErrInfo)
            return false
          }
        })
    },
    // 获取应用列表
    getApps () {
      return new Promise((resolve, reject) => {
        let params = {
          // Api.userInfo.USERID
          UserId: this.getCookie('userId') || '3'
        }
        Api.get('DS_YC_APPLICATION', params).then(res => {
          if (res.Flag) {
            this.Apps = res.MsgInfo.map(item => {
              item.children = []
              item.active = false
              item.text = item.Description
              return item
            })
            resolve()
          } else {
            this.$alert(res.ErrInfo)
          }
        })
      })
    },
    // 获取所有模块菜单（业务平台、配送平台）
    getAllMenus () {
      if (this.loginStatus) {
        for (let i = 0; i < this.Apps.length; i++) {
          let app = this.Apps[i]
          this.getMenuList(app)
        }
      }
    },
    // 新增值班人员功能
    // 获取当前值班人员
    getDuty () {
      Api.get('inf_duty_today', {})
        .then(res => {
          if (res.Flag) {
            if (res.MsgInfo.length > 0) {
              this.duty = res.MsgInfo[0]
            }
          }
        })
      Api.get('FdGetFiledDtl', { Field_Name: 'CPLS_Level_3' }).then((res) => {
        if (res.Flag) {
          let loginTime = null
          res.MsgInfo.forEach(i => {
            if (i.Value_Data === '云仓登陆时效h') {
              loginTime = i.Value_Desc
            }
          })
          let access_token = localStorage.getItem('access_token')
          if (!/^(?!0*\.?0+$)\d*\.?\d+$/.test(loginTime)) {
            loginTime = null
          }
          if (loginTime) {
            this.setCookie('access_token', access_token, this.loginMinutes(loginTime))
          }
        }
      })
    },
    loginMinutes(val) {
      return Math.round(Number(val) * 60 * 10) / 10
    },
    currentChange (row) {
      this.currentDutyRow = row
    },
    // 更换临时人员
    changeTempMember () {
      this.tempDutySettingVisible = true
      this.tempMember = {
        name: '',
        Qq: '',
        Wechat: '',
        Mobilephone: '',
        Remark: ''
      }
    },
    confirmDuty () {
      this.changeDuty(this.currentDutyRow)
    },
    changeDuty (row) {
      if (row.name !== this.duty.name) {
        if (!row.name) {
          this.$alert('姓名不能为空')
          return false
        }
        if (!row.Mobilephone) {
          this.$alert('联系方式不能为空')
          return false
        }
        // 1 更换当天值班人员  2 更换指定天值班人员
        const orginDutyMemberInfo = this.changeDutyFlag === 1 ? this.duty : this.dealDutyMember
        if (this.changeDutyFlag === 1) orginDutyMemberInfo.DutyDate = DateFtt('yyyy-MM-dd', new Date())
        this.$confirm(`是否确定将${orginDutyMemberInfo.DutyDate}系统值班人员更改为${row.name}`, '提示')
          .then(() => {
            let params = [{
              name_replace: row.name,
              name: orginDutyMemberInfo.name,
              replace_staff_id: row.Staff_Id || '',
              Staff_Id: orginDutyMemberInfo.Staff_Id,
              Mobilephone: row.Mobilephone,
              Qq: row.Qq,
              Wechat: row.Wechat,
              Remark: row.Remark,
              onduty_date: orginDutyMemberInfo.DutyDate
            }]
            Api.get('inf_duty_change', params, null, 'post')
              .then(res => {
                if (res.Flag) {
                  this.getDuty()
                  this.getzbjh()
                } else {
                  this.$alert(res.ErrInfo)
                }
              })
          })
      }
      this.dutySettingVisible = false
      this.tempDutySettingVisible = false
    },
    // 获取值班人员
    getDutyMembers () {
      Api.get('ds_onduty_getstaff', {})
        .then(res => {
          if (res.Flag) {
            this.dutyMembers = res.MsgInfo
          }
        })
    },
    // 获取登录用户基本信息
    getLoginUserBasicInfoDs () {
      if (this.operatorId === '%' || this.operatorId.indexOf(',') !== -1 || this.ldcId === '%' || this.ldcId.indexOf(',') !== -1 || (this.operatorId.split(',').length === 1 && !this.ldcId)) {
        return false
      }
      let params = {
        Ldc_Id: Api.userInfo.Ldc_Id,
        Operator_Id: Api.userInfo.Operator_Id
      }
      Api.get('get_login_user_basic_info_ds', params)
        .then(res => {
          if (res.Flag) {
            let form = res.MsgInfo[0]
            this.operatorName = form.Operator_Name + ' ' + form.Operator_No + ' ' +  ' ; ' + ' ' + form.Ldc_ShortName + ' ' + form.Ldc_No
            this.operatorText = form.Operator_Name
            this.ldcText = form.Ldc_ShortName
          }
        })
    },
    // 获取平台咨询信息
    getPlatInfo () {
      Api.get('fd_operationowner_cfg')
        .then(res => {
          if (res.Flag) {
            this.platInfo = res.MsgInfo
          }
        })
    },
    openDutySetting (changeDutyFlag) {
      // changeFlag为1表示更换当天值班人员，为2表示更换值班计划人员
      this.changeDutyFlag = changeDutyFlag
      this.dutySettingVisible = true
    },
    // 将菜单数据转换成树形结构
    toTreeData (rows, isclose) {
      var state = 'open'
      if (isclose) {
        state = 'closed'
      }
      function exists (rows, parentId) {
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].FuncId === parentId) return true
        }
        return false
      }
      var nodes = []
      // 得到顶层节点
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        if (!exists(rows, row.ParentId)) {
          let pnode = {
            id: row.FuncId,
            text: row.FuncName,
            menuCode: row.FuncCode,
            state: state,
            iconCls: row.Icons,
            classId: 1,
            topId: row.FuncId,
            IsAvailable: row.IsAvailable
          }
          if (row.FuncUrlTwo) {
            pnode.attributes = {
              url: row.FuncUrlTwo
            }
          }
          nodes.push(pnode)
        }
      }
      var toDo = []
      for (let i = 0; i < nodes.length; i++) {
        toDo.push(nodes[i])
      }
      while (toDo.length) {
        var node = toDo.shift() // 父节点
        // 得到子节点
        for (var i = 0; i < rows.length; i++) {
          let row = rows[i]
          if (row.ParentId === node.id) {
            var child = { appName: row.appName, moduleName: node.text, ParentId: row.ParentId, menuCode: row.FuncCode, id: row.FuncId, text: row.FuncName, state: state, iconCls: row.Icons, attributes: { url: row.FuncUrlTwo }, classId: node.classId + 1, AppId: row.AppId, topId: node.topId, docUrl: row.docUrl, IsAvailable: row.IsAvailable, matchFuncId: row.matchFuncId }
            if (node.children) {
              node.children.push(child)
            } else {
              node.children = [child]
            }
            toDo.push(child)
          }
        }
      }
      console.error(nodes)
      return nodes
    },
    // 通用跳转到子页面方法（非新框架所做的页面）
    jumpTo (name, url) {
      this.showIndex = -1
      this.subpage = {
        name,
        url,
        show: true
      }
    },
    jumpBack () {
      this.subpage = {}
    },
    // 切换iframe链接
    jumpFrame (playoad) {
      //已有菜单再次进入，会删除原来已存在的情况
      const index = this.$store.state.widgets.findIndex(el => el.id === playoad.id)
      if (index >= 0) {
        this.$store.commit('deleteWidget', index)
      }
      //点击添加最近访问
      if (playoad) {
        if (!this.localLink.find(el => el.text === playoad.text)) {
          if (playoad && playoad.attributes && playoad.attributes.url) {
            this.localLink.unshift(playoad)
            localStorage.setItem('localLink2', JSON.stringify(this.localLink))
          }
        } else {
          const index = this.localLink.findIndex(el => el.text === playoad.text)
          if (index >= 0) {
            const obj = {...this.localLink[index]}
            this.localLink.splice(index, 1)
            this.localLink.unshift(obj)
            localStorage.setItem('localLink2', JSON.stringify(this.localLink))
          }
        }
      }
      if (this.loginStatus) {
        if (playoad.attributes && playoad.attributes.url && /^https?\:\/\//.test(playoad.attributes.url)) {
          this.pagesDot(playoad)
          window.open(playoad.attributes.url)
        } else {
          let index = getIndexOfCollection('id', playoad.id, this.widgets)
          // this.$alert(`${index} - ${playoad.id} - ${JSON.stringify(this.widgets)}`)
          if (index === -1) { // 点击的页面未打开的情况
            if (this.widgets.length > 12) {
              this.$alert('打开应用数量超过上限')
              return false
            }
            // done 记载首页点击功能的次数
            let operatorId = Api.userInfo.Operator_Id.indexOf(',') > -1 ? Api.userInfo.Operator_Id.split(',')[0] : Api.userInfo.Operator_Id
            let roleId = Api.userInfo.RoleId.indexOf(',') > -1 ? Api.userInfo.RoleId.split(',')[0] : Api.userInfo.RoleId
            let params = [{
              app_id: playoad.AppId,
              app_name: playoad.appName,
              func_id: playoad.id,
              func_name: playoad.text,
              operator_id: operatorId,
              user_id: Api.userInfo.UserId,
              access_time: DateFtt('yyyy-MM-dd hh:mm:ss', new Date()),
              role_id: roleId,
              role_name: Api.userInfo.UserName,
              changetype: 'inserted'
            }]
            Api
              .get('DS_UPDATEMENUACCESS', params, false, 'post')
              .then(res => {
                if (!res.Flag) {
                  this.$message.error(res.ErrInfo)
                }
              })
            let temp = {
              type: 'iframe',
              appName: playoad.appName,
              moduleName: playoad.moduleName,
              name: playoad.text,
              widget: this.setUrl(playoad.attributes.url, playoad.id),
              id: playoad.id,
              pageInfo: playoad,
              icon: ''
            }
            this.currentWidget = temp
            this.pagesDot(playoad)
            setTimeout(() => {
              this.$store.commit('addWidget', temp)
            }, 10)
          } else { // 点击的页面已打开的情况
              this.currentWidget = this.$store.state.widgets[index]
              this.pagesDot(playoad)
              this.$store.commit('toggleWidget', index)
          }
        }
      } else {
        this.goLogin()
      }
    },
    // url上设置menucode
    setUrl (url, id) {
      let pos = url.indexOf('#')
      if (pos === -1) {
        return url.indexOf('?') === -1 ? url + '?menucode=' + id : url + '&menucode=' + id
      } else {
        let arr = url.split('#')
        let hash = encodeURIComponent(arr[1])
        let searchStr = `hash=${hash}&menucode=${id}`
        if (arr[0].indexOf('?') === -1) {
          searchStr = '?' + searchStr
        } else {
          searchStr = '&' + searchStr
        }
        return arr[0] + searchStr + '#' + arr[1]
        // return arr[0].indexOf('?') === -1 ? (arr[0] + '?hash=' + encodeURIComponent(arr[1]) + '#' + arr[1]) : (arr[0] + '&hash=' + encodeURIComponent(arr[1]) + '#' + arr[1])
      }
    },
    // 所有应用菜单跳转
    async jumpAllNav (playoad, type) {
      console.log('jumpAllNav', playoad)
      let result = await this.checkOperator()
      if (result && playoad.IsAvailable === 'R') {
        this.pagesDot(playoad)
        this.goNewSystem(playoad.matchFuncId)
      } else {
        if (!type) {
          if (!this.localLink.find(el => el.text === playoad.text)) {
            if (playoad && playoad.attributes && playoad.attributes.url) {
              this.localLink.unshift(playoad)
              localStorage.setItem('localLink2', JSON.stringify(this.localLink))
            }
          }
        } else {
          const index = this.localLink.findIndex(el => el.text === playoad.text)
          if (index >= 0) {
            const obj = {...this.localLink[index]}
            this.localLink.splice(index, 1)
            this.localLink.unshift(obj)
            localStorage.setItem('localLink2', JSON.stringify(this.localLink))
          }
        }
        this.frameHandler(playoad)
        this.showDrawer = false  //隐藏搜索栏
        this.hideSideBar()
      }
    },
    // 头部主菜单跳转
    async jumpMainNav (playoad) {
      let result = await this.checkOperator()
      console.log('jumpMainNav', playoad)
      // 新的跳转代码 start 20260319
      if (result && playoad.IsAvailable === 'R') { // 融合菜单需要跳转融合项目
        this.pagesDot(playoad)
        this.goNewSystem(playoad.matchFuncId)
      } else {
      // 新的跳转代码 end 20260319
        this.frameHandler(playoad)
        this.showDrawer = false  //隐藏搜索栏
        this.hideSubNav()
      }
    },
    frameHandler (playoad) {
      // 2024.11.1 huxiangli add
      const str = this.getCookie('pwd_expiration_time')
      if (str && str === '90') {
        this.$alert('密码已超过90天未修改，请修改密码!', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({
              path: '/modifyPwd'
            })
          }
        })
        return
      }
      // end
      // 20181206 huxiangli
      this.jumpBack()
      // end
      this.jumpFrame(playoad) // iframe跳转
      // 切换显示mainPage和iframe
      if (this.showMain) {
        this.$store.commit('toggleMain', false)
      }
    },
    initSocket () {
      this.socket = io('https://www.56jzt.com', { path: '/chatService/socket.io' })
      this.socket.on('connect', () => {
        this.socket.emit('join', Api.userInfo.USERID)//用户登录完成时调用该方法
      })
      this.socket.on('chat', (fromUser, data, insertId, source) => {
        this.$store.commit('addMsgNum', {
          Staff_Id: fromUser,
          num: 1
        })
      })
    },
    isHover (bool) {
      this.isMouseOver = bool
    },
    refreshMenu () {
      this.getApps().then(() => {
        this.getAllMenus()
      })
    },
    // 获取官网项目配置
    getProjectInfo () {
      let top = getAppTopWindow()
      let code = top.location.search ? qs.parse(top.location.search.substring(1)).c || '' : ''
      if (code) {
        Fetch('getProjectInfo', { peojectCode: code })
          .then(res => {
            if (res.Flag && res.MsgInfo) {
              this.projectInfo = res.MsgInfo
            } else {
              this.projectInfo = {
                showDuty: 'Y',
                show5th: 'Y',
                logo: '/static/image/home/title.png'
              }
            }
          })
      } else {
        this.projectInfo = {
          showDuty: 'Y',
          show5th: 'Y',
          logo: '/static/image/home/title.png'
        }
      }
    },
    //值班计划
    getzbjh () {
      Api.zuul('mdb/duty/info/tree').then(res => {
        if (res.code === 200) {
          this.showCalendar = true
          const planList =  res.data.map(el => {
            if (el.name.includes('区域')) {
              el.expand = this.isWorkTime(el)
            } else if (el.name.includes('值班')) {
              el.expand = this.isRestTime(el)
            } else {
              el.expand = false
            }
            return {
              ...el
            }
          })
          const itemIndex = planList.findIndex(el => el.name.includes('值班'))
          if (itemIndex !== -1) {
            if (planList[itemIndex].expand) {
              this.dutyplan = planList.map((el, index) => {
                if (index !== itemIndex) {
                  el.expand = false
                }
                return el
              })
            } else {
              this.dutyplan = planList
            }
          } else {
            this.dutyplan = planList
          }
        } else {
          this.$alert(res.message)
        }
      })
      // Api.get('inf_duty_arrange').then(res => {
      //   if (res.Flag) {
      //     this.dutyplan = res.MsgInfo.map(r => {
      //       r.date = r.DutyDate
      //       return r
      //     })
      //   }
      // })
    },
    //是否工作日
    isWorkTime (item) {
    const workWeekDays = [1, 2, 3, 4, 5] // 1 是星期一，5 是星期五
    const workStartTime = '08:30' // 工作开始时间
    const workEndTime = '18:00' // 工作结束时间
    //检查非法定节假日
    if (workWeekDays.includes(dayjs().day()) && dayjs().valueOf() >= dayjs(`${dayjs().format('YYYY-MM-DD')} ${workStartTime}`).valueOf() && dayjs().valueOf() <= dayjs(`${dayjs().format('YYYY-MM-DD')} ${workEndTime}`).valueOf()) {
      // 检查是否是工作日的工作时间
      return true
    } else {
      return false
    }
  },
    //是否休息日
  isRestTime(item) {
    const workWeekDays = [1, 2, 3, 4, 5] // 1 是星期一，5 是星期五
    const workStartTime = '08:30' // 工作开始时间
    const workEndTime = '18:00' // 工作结束时间
    if (item.children && item.children[0].holidayFlag) {
      return true
    } else if (!workWeekDays.includes(dayjs().day())) {
      // 检查是否是工作日的工作时间
      return true
    } else if (workWeekDays.includes(dayjs().day()) && dayjs().valueOf() < dayjs(`${dayjs().format('YYYY-MM-DD')} ${workStartTime}`).valueOf()) {
      return true
    } else if (workWeekDays.includes(dayjs().day()) && dayjs().valueOf() > dayjs(`${dayjs().format('YYYY-MM-DD')} ${workEndTime}`).valueOf()) {
      return true
    } else {
      return false
    }
    },
    //展开值班计划
    onExpandDuty(index, flag) {
    if (!flag) {
      this.dutyplan = this.dutyplan.map((el, idx) => {
        if (index === idx) {
          el.expand =  !flag
        } else {
          el.expand =  false
        }
        return el
      })
    } else {
      this.dutyplan[index].expand = !flag
    }
    },
    changeDutyPlan (row) {
      const roleid = Api.userInfo.RoleId
      row.name = row.NAME
      if (roleid) {
        const roles = roleid.split(',')
        if (roles.includes('31')) {
          // row.name = row.NAME
          // this.changeDuty(row)
          // this.getzbjh()
          this.dealDutyMember = row
          this.openDutySetting(2)
          return false
        }
      }
      this.$alert('更换值班人员请联系管理员')
    },
    envTagChange(e) {
      if (e.currentTarget.className === 'envTag') {
          e.currentTarget.className = 'envTag-movie'
          e.currentTarget.children[1].src = '/static/image/home/hover_up.png'
      } else {
          e.currentTarget.className = 'envTag'
          e.currentTarget.children[1].src = '/static/image/home/hover_down.png'
      }
    },
    tagDelete(e) {
        e.target.parentNode.remove()
    },
    setCookieNew(name, value, days, domain) {
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      // 设置 Cookie，注意加上 Secure 和 SameSite=None
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};domain=${domain};path=/;Secure;SameSite=None`
    },
    // 清除指定cookie
    deleteCookie(name, domain) {
      // 设置过期时间为过去的时间
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${domain};path=/;Secure;SameSite=None`
    },
        // 云仓跳转新系统
    goNewSystem (menuId) {
      let userId = this.getCookie('userId')
      let refresh_token = this.getCookie('refresh_token')
      let access_token = this.getCookie('access_token')
      let fusion_Operator_Id = Api.userInfo.Operator_Id
      let fusion_Operator_Name = Api.userInfo.Operator_Name || ''
      let fusion_Operator_No = Api.userInfo.Operator_No || ''
      let fusion_Ldc_Id = Api.userInfo.Ldc_Id
      let fusion_Ldc_Name = Api.userInfo.Ldc_Name || ''
      let fusion_Ldc_No = Api.userInfo.Ldc_No
      let dbflag = Api.userInfo.dbflag
      let switch_Operator = 'N' // 在融合那边判断是否能够切换
      let fusion_Menu_Id = menuId // 融合菜单ID 测试ID后续会从数据里面取
      if (this.operatorId === '%' || this.operatorId.indexOf(',') !== -1 || this.ldcId === '%' || this.ldcId.indexOf(',') !== -1 || (this.operatorId.split(',').length === 1 && !this.ldcId)) {
        switch_Operator = 'Y'
      } else {
        switch_Operator = 'N'
      }
      switch (window.location.hostname) {
        case '10.3.87.222':
          this.$confirm('当前功能已在新系统中，将为您自动调整到新系统!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            window.open(`http://10.3.87.222:8888/#/WaitingPage?userId=${userId}&access_token=${access_token}&refresh_token=${refresh_token}&fusion_Operator_Id=${fusion_Operator_Id}&fusion_Operator_Name=${fusion_Operator_Name}&fusion_Operator_No=${fusion_Operator_No}&fusion_Ldc_Id=${fusion_Ldc_Id}&fusion_Ldc_Name=${fusion_Ldc_Name}&fusion_Ldc_No=${fusion_Ldc_No}&fusion_Menu_Id=${fusion_Menu_Id}&fusion_dbflag=${dbflag}&switch_Operator=${switch_Operator}`, '_blank') // 测试
            })
          break
        case 'jzyc-pre.56jzt.com':
          this.$confirm('当前功能已在新系统中，将为您自动调整到新系统!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            window.open(`https://tms5-pre.56jzt.com/#/WaitingPage?userId=${userId}&access_token=${access_token}&refresh_token=${refresh_token}&fusion_Operator_Id=${fusion_Operator_Id}&fusion_Operator_Name=${fusion_Operator_Name}&fusion_Operator_No=${fusion_Operator_No}&fusion_Ldc_Id=${fusion_Ldc_Id}&fusion_Ldc_Name=${fusion_Ldc_Name}&fusion_Ldc_No=${fusion_Ldc_No}&fusion_Menu_Id=${fusion_Menu_Id}&fusion_dbflag=${dbflag}&switch_Operator=${switch_Operator}`, '_blank') // 预发
          })
          break
        case 'www.56jzt.com':
          this.$confirm('当前功能已在新系统中，将为您自动调整到新系统!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            window.open(`https://tms5.56jzt.com/#/WaitingPage?userId=${userId}&access_token=${access_token}&refresh_token=${refresh_token}&fusion_Operator_Id=${fusion_Operator_Id}&fusion_Operator_Name=${fusion_Operator_Name}&fusion_Operator_No=${fusion_Operator_No}&fusion_Ldc_Id=${fusion_Ldc_Id}&fusion_Ldc_Name=${fusion_Ldc_Name}&fusion_Ldc_No=${fusion_Ldc_No}&fusion_Menu_Id=${fusion_Menu_Id}&fusion_dbflag=${dbflag}&switch_Operator=${switch_Operator}`, '_blank') // 生产
          })
          break
      }
    },
    async checkOperator() { // 检查运营商是否需要跳转去融合
      let jumpFlag = false
      let params = {
        Operator_ID: Api.userInfo.Operator_Id,
        Para_No: 'jumpFlag'
      }
      let res = await Api.get('ds_get_tmp_operator_cfg', params)
      if (res.MsgInfo.length > 0) {
        if (res.MsgInfo[0].Para_Value === 'Y') { // 状态有这个证明运营商有白名单可以跳转
          jumpFlag = true
        }
      }
      return jumpFlag
    },
    // 页面打点
    pagesDot(playoad) {
      let params = {
        appName: playoad.appName || '',
        funcName: playoad.moduleName || '',
        pageName: playoad.text || '',
        funcId: playoad.id || '',
        funcUrlTwo: playoad.attributes ? playoad.attributes.url : '',
        createAccount: Api.userInfo.Staff_Id,
        createName: Api.userInfo.Staff_Name
      }
      Api.zuul('omsConfig/menuClick/saveMenuClick', params)
        .then(res => {
          // console.log(res)
        })
        .catch()
    }
  },
  created () {
  },
  mounted () {
    this.getProjectInfo()
    if (this.loginStatus) {
      this.getDuty()
      this.getDutyMembers()
      this.getPlatInfo()
      this.refreshMenu()
      // this.initSocket()
      this.headerHeight = this.$refs.header.offsetHeight
      let _this = this
      // 当头部搜索框展开 且窗口宽度小于1410时  隐藏头部菜单
      this.screenWidth = window.innerWidth
      window.onresize = function () {
        _this.headerHeight = _this.$refs.header.offsetHeight
        _this.screenWidth = window.innerWidth
      }
      window.jump = this.jumpFrame
      window.jumpTo = this.jumpTo
      window.jumpBack = this.jumpBack
      window.refreshMenu = this.refreshMenu
      // 刷新页面时，清除已切换运营商的dbflag cookie
      this.clearCookie('dbflag')
      this.getLoginUserBasicInfoDs()
    }
  }
}
</script>
<style lang="less">
@import '~less/color.less';
@import '~less/primary.less';
ul.worker-info {
  li {
    padding: 10px;
    cursor: pointer;
  }
  li:hover{
    background: #E7EFF7;
    color: #407FBB;
  }
}
.currentOperatorDp {
  display: block;
  max-width: 300px;
  word-wrap: break-word;
  white-space: normal;
  border-bottom: 1px solid #bac0c5;
  // overflow: hidden;
  // text-overflow: ellipsis;
}
.home {
  .header {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1000;
    font-size: 12px;
    color: #eee;
    a {
      color: #666;
    }
    img {
      display: block;
    }
    p {
      margin: 0;
    }
    .section {
      padding: 0 0 0 28px;
      display: flex;
      justify-content: space-between;
      position: relative;
      // background-color: rgba(0, 0, 0, 0.3);
      height: 63px;
      line-height: 60px;
      transition-property: background-color;
      transition-duration: 250ms;
      transition-timing-function: linear;
      background-color: #0751ac !important;
      &.navBg {
        background-color: #0751ac !important;
      }
      .nav {
        flex: 1;
        display: flex;
        .brand {
          font-size: 24px;
          color: #fff;
          padding: 20px 0;
          img {
            width: 100%;
          }
          i {
            color: #fff;
            margin-right: 10px;
            font-size: 37px;
            line-height: 63px;
            /*vertical-align: middle;*/
          }
          .title {
            display: inline-block;
            *display: inline-block;
            zoom: 1;
            vertical-align: top;
          }
        }
        .search-wrapper {
          flex: 1;
          padding-right: 30px;
          .search-box {
            position: static;
            padding: 0px;
            .search-tool {
              width: 200px;
              float: right;
              line-height: 1;
              padding-top: 15px;
              .input-with-select {
                height: 32px !important;
                background-color: #fff;
                border-radius: 4px;
              }
              .el-input-group__append,
              .el-input-group__prepend {
                background-color: #fff;
              }
              .el-select {
                width: 70px;
                input.el-input__inner {
                  width: 70px;
                }
                .el-input .el-input__icon {
                  height: @form-height-1920;
                  line-height: @form-height-1920;
                }
              }
              .el-input__inner {
                border: none;
                &:focus {
                  border: none;
                }
              }
              input {
                width: 75px;
              }
              .el-input__inner {
                /*width: 302px;*/
                height: 32px;
                box-sizing: border-box;
              }
            }
          }
        }
        .nav-wrapper {
          display: flex;
          flex: 1;
          width: 0;
          .all-nav {
            padding-left: 45px;
            .all-nav-btn {
              /*background: url('/static/image/home/icon-27.png') no-repeat left center;*/
              font-size: 20px;
              width: 20px;
              line-height: 66px;
              height: 100%;
              cursor: pointer;
              transition: transform 0.3s;
            }
            &.active .all-nav-btn {
              transform: rotate(90deg);
            }
          }
          .side-menu-wrapper {
            position: fixed;
            left: 0px;
            bottom: 0px;
          }
          .main-nav {
            box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.4);
            position: relative;
            margin-left: 5px;
            overflow: hidden;
            position: relative;
            flex: 1;
            margin-right: 25px;
            & > ul {
              display: flex;
              position: absolute;
              top: 0 !important;
              li {
                padding: 0;
                position: relative;
                transition: all 0.5s;
                & > div {
                  cursor: pointer;
                }
                a {
                  display: block;
                  position: relative;
                  // border-bottom: 2px solid transparent;
                  box-sizing: border-box;
                  color: #eee;
                  white-space: nowrap;
                  user-select: none;
                  &:after {
                    transform: scale(0);
                    transition: transform 3s;
                  }
                  .triangle {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    border: 5px solid transparent;
                    border-top: 5px solid #fff;
                    transition: all 0.5s;
                    transform: rotate(0deg);
                    transform-origin: center 25%;
                    margin-top: -2px;
                  }
                }
                &.active a:after {
                  content: '';
                  position: absolute;
                  margin-right: -12px;
                  width: 0;
                  height: 0;
                  right: 50%;
                  bottom: 0;
                  border-left: 10px solid transparent;
                  border-right: 10px solid transparent;
                  border-bottom: 12px solid #fff;
                  transition: all 0.5s;
                  transform: rotate(0deg);
                  transform-origin: center 25%;
                  transform: scale(1);
                  // position: absolute;
                  // bottom: 15px;
                  // left: 0px;
                  // right: 0px;
                  // height: 1px;
                  // transform: scale(1);
                  // background-color: #fff;
                }
                & > div:nth-of-type(1) {
                  position: relative;
                  padding: 0 18px;
                }
              }
            }
            .sub-nav {
              position: fixed;
              left: 0;
              right: 0;
              top: 63px;
              /*opacity: 0;*/
              z-index: -10;
              background-color: @sub-nav-color;
              overflow: hidden;
              /*transform: translateY(-100%);*/
              padding: 12px 100px 22px;
              box-shadow: 0 0 10px #ccc;
            }
          }
        }
      }
      .userInfo {
        display: flex;
        align-items: center;
        /*.icon.search {*/
        /*background: url('/static/image/home/icon-26.png') no-repeat left center;*/
        /*width: 17px;*/
        /*cursor: pointer;*/
        /*}*/
        .search-container {
          display: flex;
          align-items: center;
          padding-right: 0;
          height: 100%;
          vertical-align: top;
          margin-top: -5px;
          padding-right: 18px;
          & > i {
            font-size: 22px;
            /*margin-top: -5px;*/
            cursor: pointer;
            z-index: 100;
            position: relative;
            left: -30px;
          }
          .input-wrapper {
            height: 36px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            /*padding: 5px 7px;*/
            border-radius: 10px;
          }
          .el-input {
            /*line-height: inherit;*/
            border: 1px solid #eee;
            border-width: 0px;
            border-radius: 0px;
            transition: all 300ms;
            width: 0px;
            height: 30px;
            line-height: 30px;
            &.active {
              width: 200px;
              border-width: 1px;
              border-radius: 4px;
            }
            input {
              /*line-height: inherit;*/
              /*width: 100px;*/
              background-color: transparent;
              border: 0;
              border-radius: 0;
              padding: 0px;
              /*border-bottom: 1px solid #ccc;*/
              position: relative;
              left: 20px;
              color: #fff;
              left: 0px;
              padding-left: 10px;
            }
          }
        }
        .userAccount {
          display: flex;
          align-items: center;
          // margin-right: 50px;
          img {
            width: 35px;
            height: 35px;
            margin-right: 18px;
          }
          .login-btn {
            padding-left: 10px;
            line-height: 58px;
            height: 63px;
            cursor: pointer;
            padding-right:35px;
          }
          .log-text {
            color: #eee;
            cursor: pointer;
            line-height: 30px;
            // padding-right:35px;
            float: left;
            position: relative;
            top: -7px;
          }
          .log-text1 {
            color: #eee;
            cursor: pointer;
            line-height: 30px;
            padding-right:35px;
          }
          .Ldc-text {
            float:right;
            color: #eee;
            width: 9em;
            max-width: 9em;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
            top: -10px;
            white-space: nowrap;
          }
          .Operator-text {
            position: absolute;
            cursor: pointer;
            top: 9px;color: rgb(238, 238, 238);
            width: 11em;
            max-width: 11em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p {
            font-size: inherit;
            i {
              font-size: 19px;
            }
          }
          .el-dropdown {
            padding-left: 10px;
            height: 35px;
            line-height: 35px;
          }
        }
        .tool {
          display: flex;
          height: 100%;
          padding-left: 35px;
          & > div {
            display: inline-block;
            vertical-align: middle;
            position: relative;
            cursor: pointer;
            &.order,
            &.refresh,
            &.search,
            &.message,
            &.worker,
            &.support {
              height: 100%;
              background-size: 100%;
              margin-left: 35px;
            }
            &.message {
              height: 100%;
              background-size: 100%;
            }
            &.support {
              display: flex;
              align-items: center;
              img {
                width: 18px;
                height: 18px;
                margin-top: -5px;
              }
            }
            &.quit {
              /*background: url('/static/image/home/icon-20.png') no-repeat left center;*/
              /*width: 18px;*/
            }
            &.order {
              a {
                color: #fff;
              }
              /*background: url('/static/image/home/icon-21.png') no-repeat left center;*/
              /*width: 17px;*/
            }
            &.quit,
            &.order,
            &.search,
            &.refresh,
            &.message,
            &.worker,
            &.application,
            &.worker {
              width: 20px;
              font-size: 20px;
              line-height: 63px;
            }
            &.refresh {
              font-size: 22px;
              position: relative;
              top: -3px;
            }
            &.worker {
              font-size: 20px;
              position: relative;
              top: -2px;
            }
            &.application {
              padding: 0px 35px;
            }
            &.message {
              /*background: url('/static/image/home/icon-22.png') no-repeat left center;*/
              width: 20px;
              .circle {
                left: 16px;
              }
            }
            &.application {
              /*background: url('/static/image/home/icon-23.png') no-repeat left center;*/
              width: 18px;
              margin-right: 0;
              position: relative;
              .circle {
                left: 40px;
              }
              .application-menu {
                position: absolute;
                right: -10px;
                top: 63px;
                background-color: @deep-main-color;
                width: 150px;
                padding: 10px 0;
                li {
                  &.active {
                    background-color: @main-color;
                  }
                  padding: 0 30px 0 30px;
                  font-size: 12px;
                  line-height: 30px;
                  position: relative;
                  &.home:before {
                    content: '';
                    width: 12px;
                    height: 12px;
                    background: url('/static/image/home/icon-28.png') no-repeat
                      left center;
                    margin-top: -6px;
                    border-radius: 0;
                    left: 13px;
                  }
                  &:before {
                    content: '';
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background-color: #fff;
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    margin-top: -2px;
                  }
                  .close {
                    position: absolute;
                    top: 50%;
                    margin-top: -7px;
                    right: 10px;
                    width: 18px;
                    height: 18px;
                    border-radius: 9px;
                    background: #063696 url('/static/image/home/icon-29.png')
                      no-repeat center;
                    display: none;
                    animation: scale-close 500ms;
                  }
                  &:hover {
                    background-color: @main-color;
                  }
                  &:hover .close {
                    display: block;
                  }
                  &.home:hover .close {
                    display: none;
                  }
                  a {
                    color: #fff;
                    white-space: nowrap;
                    overflow: hidden;
                    display: block;
                  }
                }
                .bottom {
                  margin: 8px 5px 0px 5px;
                  padding: 10px 10px 0px 10px;
                  border-top: 1px dashed #fff;
                  line-height: 1;
                  display: flex;
                  font-size: 14px;
                  .item {
                    flex: 1;
                    text-align: center;
                  }
                }
              }
            }
            .circle {
              position: absolute;
              min-width: 16px;
              height: 16px;
              border-radius: 8px;
              background-color: #e61f1f;
              color: #fff;
              font-size: 12px;
              line-height: 16px;
              text-align: center;
              padding: 0 4px;
              box-sizing: border-box;
              top: 14px;
            }
          }
          & :first-child {
            margin-left: 0px !important;
          }
        }
      }
      .secondWay {
        position: absolute;
        left: 0;
        right: 0;
        top: 63px;
        background-color: rgba(79, 160, 216, 0.6);
        text-align: center;
        .el-input {
          width: 40%;
        }
        .el-input__inner {
          width: 100%;
          height: 32px;
          line-height: 32px;
          /*box-sizing: border-box;*/
        }
      }
    }
    .online-document {
      margin-left: 35px;
      line-height: 63px;
      display: flex;
      align-items: center;
      position: relative;
      top: -2px;
    }
  }
  .search-box {
    padding: 10px 0 20px 0;
    background-color: @main-color;
    position: fixed;
    top: 63px;
    left: 0px;
    right: 0px;
    z-index: 10;
    .search-tool {
      width: 300px;
      margin: 0px auto;
      .el-input-group__append,
      .el-input-group__prepend {
        background-color: #fff;
        border: none;
        border: 0;
      }
      .el-select {
        width: 70px;
        input.el-input__inner {
          width: 70px;
        }
        .el-input .el-input__icon {
          height: @form-height-1920;
          line-height: @form-height-1920;
        }
      }
      .el-input__inner {
        border: none;
        &:focus {
          border: none;
        }
      }
      input {
        width: 300px;
      }
      .el-input__inner {
        /*width: 302px;*/
        height: 32px;
        box-sizing: border-box;
      }
    }
  }
  .content-wrapper {
    padding-top: 63px;
  }
  .chat-modal {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    .chat-wrapper {
      width: 800px;
      height: 560px;
      background-color: #fff;
      position: relative;
      .tool {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 18px;
        .close {
          padding: 0 10px;
          cursor: pointer;
        }
      }
    }
  }
  .dutyplan-title{
    display: flex;
    justify-content: space-between;
    padding:12px 10px;
    background-color: #ebebeb;
    font-size: 14px;
    font-weight: bold;
  }
  .dutyplan-title__text{
    display: flex;
    // justify-content: space-between;
    align-items: center;
    &--icon{
      width:20px;
      height:20px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right:10px;
      > img {
        width: 100%;
        height: 100%;
        border: 0
      }
    }
  }
  .dutyplan-title__icon{
    cursor: pointer;
  }
  .dutyplan-content{
    margin-bottom:20px;
  }
  .el-dialog__header{
    background-color: #f5f5f5 !important;
  }
}
.dutymb {
  color: #666;
}
.dutymb.active {
  color: #1360aa;
}
@keyframes scale-close {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
<style lang="less">
.home {
  position:relative;
  .ql-editor ol,
  .ql-editor ul {
    padding-left: initial;
    margin-left: -4px;
  }
}
.el-popover{
  padding:12px 0 !important;
  }
.el-dialog {
  ol,
  ul {
    padding-left: initial;
  }
  .change-content {
    white-space: pre-line;
  }
  img {
    width: 100px;
    height: 100px;
    border: 1px solid black;
    cursor: pointer;
  }
}
.envTag {
  position: absolute;
  left: 0;
  height: 0.4rem;
  display: flex;
  z-index: 101;
  left: 0;
  top:50%;
  transform: translate(0, -50%);
}
.envTag-shade{
    position: absolute;
    height: 0.4rem;
    opacity: 0;
}
.envTag-shade:hover{
    position: absolute;
    height: 0.4rem;
    opacity: 1;
    transition: opacity 0.5s ease;
    z-index: 102;
}
.envTag-movie {
  position: absolute;
  left: 0;
  top: 100px;
  height: 0.4rem;
  display: flex;
}
// @keyframes slideInFromRight {
//   from {
//     transform: translateX(100%); /* 从视图的右侧开始 */
//     opacity: 0; /* 开始时完全透明 */
//   }
//   to {
//     transform: translateX(0); /* 移动到初始位置 */
//     opacity: 1; /* 完全不透明 */
//   }
// }
.drawerSearch{
  height: 85vh;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 5px;
      background-color: #f7f7f7
  }
  &::-webkit-scrollbar-track {
    border: none !important; /* 移除边框 */
    background: transparent !important
  }
  /* 滑块样式 */
  &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: #c7c7c7;
  }
}

/* 运营商和物流中心简称样式 */
.operator-info-wrap,
.logistics-short-wrap {
  display: inline-flex;
  align-items: center;
}

.operator-label {
  font-size: 12px;
  color: #909399;
  margin-right: 4px;
}

.operator-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.logistics-short {
  font-size: 14px;
  color: #606266;
  max-width: 10em; /* 限制10个汉字宽度 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.comma {
  color: #606266;
  font-weight: 500;
  margin-left: 2px;
}

/* 调整userAccount布局 */
.userAccount {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 确保下拉菜单中的当前信息也有限制 */
// .currentOperatorDp {
//   max-width: 200px;
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;
//   display: inline-block;
// }
.drawer{
  width:100vw;
  height:100vh;
  position:absolute;
  left:0;
  top:63px;
  display: flex;
  // animation: slideInFromRight 1s ease-out forwards; /* 应用动画 */
  z-index: 2000;
  .el-input__inner{
    padding-left:0;
  }
  &-mask{
    background-color: rgba(0,0,0,0.4);
    height:100%;
    width:65%;
  }
  &-content{
    height:100%;
    width: 34%;
    background-color: #fff;
    padding:15px 20px;
    &__search{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border:2px solid #0751ac;
      border-radius: 20px;
      padding: 0 20px;
    }
    &__last{
      margin:15px 0;
    }
    &__lastcontent{
// <!--border-bottom: 1px solid #c4c1c1;-->
      margin-bottom: 10px;
    }
    .disable{
      color:#c2c1c1;
    }
    &__list{
      padding:10px 0;
      border-bottom: 1px solid #f7f7f7;
      cursor: pointer;
      &--title{
        font-weight: 600;
        font-size: 16px;
      }
      &--text{
        margin-top:10px;
        font-size: 14px;
      }
    }
    &__list:hover{
      // color:#0751ac;
    }
    &__empty{
      text-align: center;
      margin-top:120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      &--content{
        width:100px;
        height:100px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom:10px;
        >img {
          max-width: 100%;
        }
      }
    }
    .el-input__inner {
      border:0
    }
  }
}
</style>
