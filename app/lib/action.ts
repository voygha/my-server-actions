'use server';
import Todo from "@/app/models/todoModel";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/app/lib/db";

export const createTodos = async (formData: FormData): Promise<string | {message: string}> => {
    await connectToMongoDB();
    const todo = formData.get("todo") as string;
    const todoDeadline = formData.get("todoDeadline") as string; // Assuming it's a string in the form data
    try {
        const newTodo = await Todo.create({
            todo,
            todoDeadline: new Date(todoDeadline), // Ensure it's stored as a Date
        });
        await newTodo.save();
        revalidatePath("/");
        return newTodo.toString();
    } catch (error) {
        console.log(error);
        return {message: 'error creating todo'};
    }
};

export const deleteTodo = async (formData: FormData): Promise<string | {message: string}> => {
    const todoId = formData.get("id") as string;
    try {
        await Todo.deleteOne({_id: todoId});
        revalidatePath("/");
        return 'todo deleted';
    } catch (error) {
        console.log(error);
        return {message: 'error deleting todo'};
    }
};
