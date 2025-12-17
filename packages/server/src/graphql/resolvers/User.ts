import { BoolTy, IntTy, StrTy } from "@ftc-scout/common";
import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { User } from "../../db/entities/User";
import { authenticateUser } from "../../auth/auth";
import { GQLContext } from "../context";

export const UserGQL: GraphQLObjectType = new GraphQLObjectType<User>({
    name: "User",
    fields: () => ({
        id: IntTy,
        username: StrTy,
        canClipVideos: BoolTy,
    }),
});

export const UserQueries: Record<string, GraphQLFieldConfig<any, GQLContext>> = {
    me: {
        type: UserGQL,
        resolve: async (_, __, context) => {
            return context.user || null;
        },
    },
};

export const UserMutations: Record<string, GraphQLFieldConfig<any, GQLContext>> = {
    login: {
        type: UserGQL,
        args: {
            username: StrTy,
            password: StrTy,
        },
        resolve: async (_, { username, password }: { username: string; password: string }, context) => {
            const user = await authenticateUser(username, password);
            if (!user) {
                throw new Error("Invalid username or password");
            }
            context.req.session.userId = user.id;
            context.user = user;
            return user;
        },
    },
    logout: {
        ...BoolTy,
        resolve: async (_, __, context) => {
            return new Promise((resolve) => {
                context.req.session.destroy(() => {
                    context.user = undefined;
                    resolve(true);
                });
            });
        },
    },
};
