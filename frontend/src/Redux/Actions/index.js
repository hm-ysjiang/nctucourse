import { createActions } from 'redux-actions'
import axios from 'axios'
import fakeData from '../../Resources/fake_data'
import { makeCourseObject, makeObjFromArray } from '../../Util/dataUtil/course'
import { isDev } from '../../Util/dev'
import * as gpaTool from '../../Util/dataUtil/gpa'

export const FETCH_STATUS = {
    IDEL: 1,
    FETCHING: 2,
    SUCCESS: 3,
    FAIL: 4
}

export const actions = createActions({
    USER: {
        STORE: null
    },
    DATABASE: {
        STORE: null
    },
    QUERY: {
        STORE: null
    },
    COLLECT: {
        STORE: null,
        COURSE_IDS: {
            ADD: null,
            REMOVE: null,
            STORE: null
        }
    },
    TIMETABLE: {
        STORE: null,
        COURSE_IDS: {
            ADD: null,
            REMOVE: null,
            STORE: null
        }
    },
    SETTINGS: {
        STORE: null
    },
    HOVER_COURSE: null,
    CANCEL_HOVER_COURSE: null,
    GPA: {
        STORE: null
    }
})

export const fetchDatabase = () => dispatch => {
    axios.get('/api/courses/all')
        .then(res => res.data.url)
        .then(url =>
            axios.get(url).then(res => {
                dispatch(actions.database.store({
                    status: FETCH_STATUS.SUCCESS,
                    ...res.data,
                    courses: res.data.courses.map(makeCourseObject).reduce(makeObjFromArray('cos_id'), {}),
                    categoryMap: res.data.category_map
                }))
                dispatch(fetchUserCollect())
            }))
        .catch(err => {
            if (isDev) {
                dispatch(actions.database.store({
                    status: FETCH_STATUS.SUCCESS,
                    ...fakeData,
                    courses: fakeData.courses.map(makeCourseObject).reduce(makeObjFromArray('cos_id'), {})
                }))
                dispatch(fetchUserCollect())
            }
            else {
                dispatch(actions.database.store({
                    status: FETCH_STATUS.FAIL
                }))
            }
        })
}

export const fetchUserInfo = () => dispatch => {
    dispatch(actions.user.store({ status: FETCH_STATUS.FETCHING }))
    axios.get('/api/accounts/me')
        .then(res => {
            dispatch(actions.user.store({ ...res.data, status: FETCH_STATUS.SUCCESS }))
        }).catch(err => {
            console.log(err)
            if (isDev)
                dispatch(actions.user.store({ is_anonymous: false, username: '0716000', status: FETCH_STATUS.SUCCESS, }))
            else
                dispatch(actions.user.store({ is_anonymous: true, status: FETCH_STATUS.FAIL }))
        })
}

export const fetchUserCollect = () => dispatch => {
    axios.get('/api/courses/user')
        .then(res => {
            const { courses } = res.data
            let collect = []
            let timetable = []
            for (let course of courses) {
                collect.push(course['courseId'])
                if (course['visible']) { timetable.push(course['courseId']) }
            }
            dispatch(actions.collect.courseIds.store(collect))
            dispatch(actions.timetable.courseIds.store(timetable))
        }).catch(err => console.log)
}

export const addColeectCourse = (courseId, visible) => dispatch => {
    axios.post('/api/courses/user', { courseId, visible }).then(() => {
        dispatch(actions.collect.courseIds.add(courseId))
        dispatch(actions.timetable.courseIds.add(courseId))
    }).catch(err => {
        console.log(err)
        if (isDev) {
            dispatch(actions.collect.courseIds.add(courseId))
            dispatch(actions.timetable.courseIds.add(courseId))
        }
    })
}

export const removeCollectCourse = (courseId) => dispatch => {
    axios.delete('/api/courses/user', { data: { courseId } }).then(() => {
        dispatch(actions.collect.courseIds.remove(courseId))
        dispatch(actions.timetable.courseIds.remove(courseId))
    }).catch(err => {
        console.log(err)
        if (isDev) {
            dispatch(actions.collect.courseIds.remove(courseId))
            dispatch(actions.timetable.courseIds.remove(courseId))
        }
    })
}

export const toggleCollectCourseVisible = (courseId, visible) => dispatch => {
    axios.put('/api/courses/user', { courseId, visible }).then(() => {
        if (visible) dispatch(actions.timetable.courseIds.add(courseId))
        else dispatch(actions.timetable.courseIds.remove(courseId))
    }).catch(err => {
        console.log(err)
        if (isDev) {
            if (visible) dispatch(actions.timetable.courseIds.add(courseId))
            else dispatch(actions.timetable.courseIds.remove(courseId))
        }
    })
}

export const clearAllUserCourse = () => dispatch => {
    axios.get('/api/courses/user/clear').then(() => {
        dispatch(actions.timetable.courseIds.store([]))
        dispatch(actions.collect.courseIds.store([]))
    }).catch(err => {
        console.log(err)
        if (isDev) {
            dispatch(actions.timetable.courseIds.store([]))
            dispatch(actions.collect.courseIds.store([]))
        }
    })
}

export const fetchGPAData = () => dispatch => {
    axios.get('/api/gpa/me').then((res) => {
        let courses = JSON.parse(res.data['data']).filter(gpaTool.filterNotCourse)
        let credits = gpaTool.getCredits(courses)
        let [last60Courses, last60Credits] = gpaTool.getLast60Courses(courses)
        let sum = (a, b) => a + b

        dispatch(actions.gpa.store({
            courses: courses,
            overall40GPA: courses.map(c => gpaTool.courseTo40Point(c) * c.cos_credit).reduce(sum) / credits,
            overall43GPA: courses.map(c => gpaTool.courseTo43Point(c) * c.cos_credit).reduce(sum) / credits,
            last6040GPA: last60Courses.map(c => gpaTool.courseTo40Point(c) * c.cos_credit).reduce(sum) / last60Credits,
            last6043GPA: last60Courses.map(c => gpaTool.courseTo43Point(c) * c.cos_credit).reduce(sum) / last60Credits,
            last60Credits: last60Credits
        }))
    })
}

export const loadSavedSettings = () => (dispatch, getState) => {
    if (window.localStorage && window.localStorage.getItem('course_setting') != null) {
        let defaults = getState().settings
        try {
            let saved = JSON.parse(window.localStorage.getItem('course_setting'))
            for (let key in defaults) {
                if (saved[key] != undefined) {
                    defaults[key] = saved[key]
                }
            }
            window.localStorage.setItem('course_setting', JSON.stringify(defaults))
        }
        catch{
            window.localStorage.setItem('course_setting', JSON.stringify({}))
        }
        dispatch(actions.settings.store(defaults))
    }
}

export const updateSetting = (key, value) => dispatch => {
    dispatch(actions.settings.store({ [key]: value }))
    if (window.localStorage) {
        try {
            if (window.localStorage.getItem('course_setting') == null) {
                window.localStorage.setItem('course_setting', JSON.stringify({}))
            }
            let settings = JSON.parse(window.localStorage.getItem('course_setting'))
            settings[key] = value
            window.localStorage.setItem('course_setting', JSON.stringify(settings))
        }
        catch{
            window.localStorage.setItem('course_setting', JSON.stringify({}))
        }
    }
}