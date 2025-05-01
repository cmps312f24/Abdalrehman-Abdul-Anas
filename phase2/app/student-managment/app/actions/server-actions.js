'use server'
import repo from "@/app/repository/Repo"
import { redirect } from 'next/navigation'
import { use } from "react";

export async function loginAction(email,pass) {
    const user= await repo.getUser(email,pass);
    if (!user) {
        return;
    }
    return user;
}