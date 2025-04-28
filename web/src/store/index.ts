import { createStore } from 'vuex'
import { defineAsyncComponent, shallowRef } from 'vue'
import { State } from '@/store/interface'
import axios from '@/utils/axios.ts'
import { IBasicInfo } from './interface/basicinfo.ts'
import { ISkills } from './interface/skills.ts'
import { IMenus } from './interface/menus.ts'
import { ITags } from './interface/Tags.ts'
import { IWorksExperience } from './interface/works.ts'
import { IProjectExperience } from './interface/project.ts'
import { IEducation } from './interface/education.ts'
import { IEvaluation } from './interface/evaluation.ts'
import { IHonors } from './interface/honors.ts'
import { IIntentions } from './interface/intentions.ts'
import { IApplicationInfo, ICourseGrade } from './interface/applicationinfo.ts'
import { ISlogan } from './interface/slogan.ts'
import { ISetting } from './interface/setting.ts'

const store = createStore<State>({
  state: {
    menus: [],
    works: [],
    campus: [],
    project: [],
    education: [],
    skillsTags: [],
    honorsTags: [],
    internship: [],
    hobbiesTags: [],
    courseGrade: [],
    skills: {} as ISkills,
    slogan: {} as ISlogan,
    setting: {} as ISetting,
    honors: {} as IHonors,
    hobbies: {} as IHonors,
    basicInfo: {} as IBasicInfo,
    evaluation: {} as IEvaluation,
    intentions: {} as IIntentions,
    applicationInfo: {} as IApplicationInfo,
  },
  mutations: {
    setSkillsTags(state, data: ITags[]) {
      state.skillsTags = data
    },
    setHonorsTags(state, data: ITags[]) {
      state.honorsTags = data
    },
    setHobbiesTags(state, data: ITags[]) {
      state.hobbiesTags = data
    },
    setMenus(state, data: IMenus[]) {
      state.menus = data
    },
    setBasicInfo(state, data: IBasicInfo) {
      state.basicInfo = data
    },
    setSkills(state, data: ISkills) {
      state.skills = data
    },
    setSlogan(state, data: ISlogan) {
      state.slogan = data
    },
    setSetting(state, data: ISetting) {
      state.setting = data
    },
    setHonors(state, data: IHonors) {
      state.honors = data
    },
    setHobbies(state, data: IHonors) {
      state.hobbies = data
    },
    setWorks(state, data: IWorksExperience[]) {
      state.works = data
    },
    setInternship(state, data: IWorksExperience[]) {
      state.internship = data
    },
    setCampus(state, data: IWorksExperience[]) {
      state.campus = data
    },
    setProject(state, data: IProjectExperience[]) {
      state.project = data
    },
    setEducation(state, data: IEducation[]) {
      state.education = data
    },
    setEvaluation(state, data: IEvaluation) {
      state.evaluation = data
    },
    setIntentions(state, data: IIntentions) {
      state.intentions = data
    },
    setApplicationInfo(state, data: IApplicationInfo) {
      state.applicationInfo = data
    },
    setCourseGrade(state, data: ICourseGrade[]) {
      state.courseGrade = data
    },
  },
  getters: {
    getSkillsTags(state): ITags[] {
      return state.skillsTags
    },
    getHonorsTags(state): ITags[] {
      return state.honorsTags
    },
    getHobbiesTags(state): ITags[] {
      return state.hobbiesTags
    },
    getMenus(state): IMenus[] {
      return state.menus
    },
    getBasicInfo(state): IBasicInfo {
      return state.basicInfo
    },
    getSkills(state): ISkills {
      return state.skills
    },
    getSlogan(state): ISlogan {
      return state.slogan
    },
    getSetting(state): ISetting {
      return state.setting
    },
    getHonors(state): IHonors {
      return state.honors
    },
    getHobbies(state): IHonors {
      return state.hobbies
    },
    getWorks(state): IWorksExperience[] {
      return state.works
    },
    getInternship(state): IWorksExperience[] {
      return state.internship
    },
    getCampus(state): IWorksExperience[] {
      return state.campus
    },
    getProject(state): IProjectExperience[] {
      return state.project
    },
    getEducation(state): IEducation[] {
      return state.education
    },
    getEvaluation(state): IEvaluation {
      return state.evaluation
    },
    getIntentions(state): IIntentions {
      return state.intentions
    },
    getApplicationInfo(state): IApplicationInfo {
      return state.applicationInfo
    },
    getCourseGrade(state): ICourseGrade[] {
      return state.courseGrade
    },
    getResumesName() {},
  },
  actions: {
    async fetchMenus({ commit }) {
      try {
        const response = await axios.get('/menus')
        if (!response.data.data) {
          commit('setMenus', [])
          return
        }
        const menus: IMenus[] = response.data.data.map((menu: IMenus) => {
          return {
            ...menu,
            form: shallowRef(
              defineAsyncComponent(
                () => import(`@/components/form/F${menu.name}.vue`),
              ),
            ),
            module: shallowRef(
              defineAsyncComponent(
                () => import(`@/components/resume/P${menu.name}.vue`),
              ),
            ),
          }
        })
        commit('setMenus', menus)
      } catch (error) {console.log(error)}
    },
    async fetchBasicInfo({ commit }) {
      try {
        const response = await axios.get('/basicinfo')
        commit('setBasicInfo', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchSkillsTags({ commit }) {
      try {
        const response = await axios.get('/tags?type=0')
        commit('setSkillsTags', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchHonorsTags({ commit }) {
      try {
        const response = await axios.get('/tags?type=1')
        commit('setHonorsTags', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchHobbiesTags({ commit }) {
      try {
        const response = await axios.get('/tags?type=2')
        commit('setHobbiesTags', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchSkills({ commit }) {
      try {
        const response = await axios.get('/skills')
        if (response.data.code !== 200) {
          response.data.data = {}
        }
        if (!response.data.data.checkedTags) {
          response.data.data.checkedTags = {}
        }

        commit('setSkills', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchHonors({ commit }) {
      try {
        const response = await axios.get('/honors')
        if (!response.data.data.checkedTags) {
          response.data.data.checkedTags = {}
        }
        if (!response.data.data.checkedTags) {
          response.data.data.checkedTags = []
        }
        commit('setHonors', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchHobbies({ commit }) {
      try {
        const response = await axios.get('/hobbies')
        if (!response.data.data.checkedTags) {
          response.data.data.checkedTags = {}
        }
        if (!response.data.data.checkedTags) {
          response.data.data.checkedTags = []
        }
        commit('setHobbies', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchWorks({ commit }) {
      try {
        const response = await axios.get('/works')
        commit('setWorks', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchInternship({ commit }) {
      try {
        const response = await axios.get('/internship')
        commit('setInternship', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchCampus({ commit }) {
      try {
        const response = await axios.get('/campus')
        commit('setCampus', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchProject({ commit }) {
      try {
        const response = await axios.get('/project')
        commit('setProject', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchEducation({ commit }) {
      try {
        const response = await axios.get('/education')
        commit('setEducation', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchEvaluation({ commit }) {
      try {
        const response = await axios.get('/evaluation')
        commit('setEvaluation', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchIntentions({ commit }) {
      try {
        const response = await axios.get('/intentions')
        commit('setIntentions', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchApplicationInfo({ commit }) {
      try {
        const response = await axios.get('/applicationinfo')
        commit('setApplicationInfo', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchCourseGrade({ commit }) {
      try {
        const response = await axios.get('/applicationinfo/grade')
        commit('setCourseGrade', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchSlogan({ commit }) {
      try {
        const response = await axios.get('/slogan')
        commit('setSlogan', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchSetting({ commit }) {
      try {
        const response = await axios.get('/setting')
        commit('setSetting', response.data.data)
      } catch (error) {console.log(error)}
    },
    async fetchResumesName() {
      try {
        const response = await axios.get('/resumes/id')
        if (response.data.code !== 200) {
          document.title = '简历列表 - 个人简历'
          return
        }
        document.title = `${response.data.data.name}的简历 - 个人简历`
      } catch (error) {console.log(error)}
    },
  },
})

// 在组件初始化时调用 fetchMenus
for (const item of Object.keys(store.getters)) {
  store
    .dispatch(`fetch${item.slice(3, item.length)}`)
    .catch((error) =>
      console.error(`Initial fetch${item.slice(3, item.length)} error:`, error),
    )
}

export default store
