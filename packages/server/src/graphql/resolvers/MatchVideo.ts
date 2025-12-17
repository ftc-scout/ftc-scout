import { BoolTy, IntTy, Season, StrTy, list, nn } from "@ftc-scout/common";
import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { MatchVideo } from "../../db/entities/MatchVideo";
import { GQLContext } from "../context";
import { UserGQL } from "./User";

export const MatchVideoGQL: GraphQLObjectType = new GraphQLObjectType<MatchVideo>({
    name: "MatchVideo",
    fields: () => ({
        id: IntTy,
        eventSeason: IntTy,
        eventCode: StrTy,
        matchId: IntTy,
        youtubeUrl: StrTy,
        startTime: IntTy,
        endTime: IntTy,
        createdBy: {
            type: nn(UserGQL),
            resolve: async (video) => {
                return video.createdBy;
            },
        },
    }),
});

export const MatchVideoQueries: Record<string, GraphQLFieldConfig<any, GQLContext>> = {
    getMatchVideos: {
        type: list(nn(MatchVideoGQL)),
        args: {
            eventSeason: IntTy,
            eventCode: StrTy,
            matchId: IntTy,
        },
        resolve: async (
            _,
            {
                eventSeason,
                eventCode,
                matchId,
            }: { eventSeason: number; eventCode: string; matchId: number }
        ) => {
            return MatchVideo.find({
                where: {
                    eventSeason: eventSeason as Season,
                    eventCode,
                    matchId,
                },
                relations: ["createdBy"],
            });
        },
    },
    getAllMatchVideos: {
        type: list(nn(MatchVideoGQL)),
        resolve: async () => {
            return MatchVideo.find({
                relations: ["createdBy"],
            });
        },
    },
};

export const MatchVideoMutations: Record<string, GraphQLFieldConfig<any, GQLContext>> = {
    createMatchVideo: {
        type: nn(MatchVideoGQL),
        args: {
            eventSeason: IntTy,
            eventCode: StrTy,
            matchId: IntTy,
            youtubeUrl: StrTy,
            startTime: IntTy,
            endTime: IntTy,
        },
        resolve: async (
            _,
            {
                eventSeason,
                eventCode,
                matchId,
                youtubeUrl,
                startTime,
                endTime,
            }: {
                eventSeason: number;
                eventCode: string;
                matchId: number;
                youtubeUrl: string;
                startTime: number;
                endTime: number;
            },
            context
        ) => {
            if (!context.user || !context.user.canClipVideos) {
                throw new Error("Unauthorized: You must be logged in and have permission to clip videos");
            }

            const video = await MatchVideo.create({
                eventSeason: eventSeason as Season,
                eventCode,
                matchId,
                youtubeUrl,
                startTime,
                endTime,
                createdByUserId: context.user.id,
            }).save();

            // Load the relation
            return MatchVideo.findOne({
                where: { id: video.id },
                relations: ["createdBy"],
            });
        },
    },
    deleteMatchVideo: {
        ...BoolTy,
        args: {
            id: IntTy,
        },
        resolve: async (_, { id }: { id: number }, context) => {
            if (!context.user) {
                throw new Error("Unauthorized: You must be logged in to delete videos");
            }

            const video = await MatchVideo.findOne({ where: { id } });
            if (!video) {
                throw new Error("Video not found");
            }

            // Only allow the creator to delete
            if (video.createdByUserId !== context.user.id) {
                throw new Error("Unauthorized: You can only delete your own videos");
            }

            await video.remove();
            return true;
        },
    },
};
