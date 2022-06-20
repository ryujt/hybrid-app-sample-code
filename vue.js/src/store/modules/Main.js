export default {
    namespaced: true,
    state: {
        memberInfo: {},
        showLoadingIcon: false,
    },

    mutations: {
        setMemberInfo: (state, value) => {
            state.memberInfo = value;
        },
        setLoadingIcon: (state, value) => {
            state.showLoadingIcon = value;
        },
    },

    actions: {
        setMemberInfo: ({ commit }, value) => {
            commit("setMemberInfo", value);
        },
        setLoadingIcon: ({ commit }, value) => {
            commit("setLoadingIcon", value);
        },
    },

    getters: {
    },
};
