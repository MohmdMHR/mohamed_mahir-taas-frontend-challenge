//Http Instance
import axios from 'axios'
const api = 'https://api.github.com/';

const http = axios.create({
    baseURL: api,
    timeout: 30000, // indicates, 1000ms ie. 1 second
    headers: {
        'Content-Type': 'application/json'
    }
});

// APIS
const GITHUB_API = 'https://api.github.com/users/'
const GITHUB_API_REPOS = 'https://api.github.com/repos/'
//Search by user name, fetches repos of given user
const getUsers = async (user) => {
    if(user){
        try {
            return http.get(GITHUB_API+user+'/repos')
        }
        catch(e){
            console.log(e)
        }
    }
    return null
}

// get repos of given branch
const getRepos = async (payload) => {
    const user = payload.user;
    const repo = payload.repo
    if(user && repo){
        try {
            return http.get(GITHUB_API_REPOS+user+'/'+repo+'/branches')
        }
        catch(e){
            console.log(e)
        }
    }
    return null
}

//get commits of given branch
const getCommits = async (payload) => {
    const user = payload.user
    const repo = payload.repo
    const branch = payload.branch

    if(user && repo){
        try {
            return http.get(GITHUB_API_REPOS+user+'/'+repo+'/commits?sha='+branch)
        }
        catch(e){
            console.log(e)
        }
    }
}

export const githubService = {
    getUsers,
    getRepos,
    getCommits
}

