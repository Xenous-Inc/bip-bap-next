import { z } from 'zod';
import { password } from '~/shared/api/schema/password';
import { updateUserProfileSchema } from '~/shared/api/schema/updateUserProfile';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
    updateProfile: protectedProcedure.input(updateUserProfileSchema).mutation(async ({ ctx, input }) => {
        await ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: input,
        });
    }),
    updatePassword: protectedProcedure.input(password).mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.update({
            where: { id: ctx.session.user.id, password: input.oldPassword },
            data: {
                password: input.oldPassword,
            },
        });

        if (!user) {
            throw new Error('Пользователь не найден');
        }
    }),
});
