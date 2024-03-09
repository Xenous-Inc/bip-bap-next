import bcrypt from 'bcrypt';
import { updateUserPasswordSchema } from '~/shared/api/schema/updateUserPassword';
import { updateUserProfileSchema } from '~/shared/api/schema/updateUserProfile';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
    updateProfile: protectedProcedure.input(updateUserProfileSchema).mutation(async ({ ctx, input }) => {
        await ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: input,
        });
    }),
    updatePassword: protectedProcedure.input(updateUserPasswordSchema).mutation(async ({ ctx, input }) => {
        const hashedNewPassword = await bcrypt.hash(input.newPassword, 10);
        //TODO: add phone filter after add provider for phone
        const user = await ctx.db.user.findUnique({
            where: { email: input.email },
        });
        if (!user) {
            throw new Error('Пользователь не найден');
        }
        if (user.id !== ctx.session.user.id) {
            throw new Error('Вы не имеете доступа к изменению пароля');
        }
        if (!user.password) {
            throw new Error('Пароля нет');
        }
        const isPasswordMatch = await bcrypt.compare(input.oldPassword, user.password);
        if (!isPasswordMatch) {
            throw new Error('Старый пароль не совпадает');
        }
        const updatedUser = await ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: {
                password: hashedNewPassword,
            },
        });

        return updatedUser;
    }),
});
