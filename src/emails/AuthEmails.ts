import { transport } from "../config/nodemailer";

interface IEmail {
    email: string;
    token: string;
    name: string
}

export class AuthEmail {
    static validarEmail = async ({ name, email, token }: IEmail) => {
        const url = `${process.env.FRONTEND_URL}/auth/confirm-account`;
        
        await transport.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'Por favor, confirma tu cuenta de UpTask.',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #9333EA;">Bienvenido a UpTask</h1>
                    <p>Hola, <strong>${name}</strong></p>
                    <p>Gracias por registrarte en <strong>UpTask</strong>. Para completar tu registro y comenzar a gestionar tus tareas, necesitamos que confirmes tu cuenta.</p>
                    <p style="margin: 20px 0; font-size: 16px;">
                        Por favor, haz clic en el siguiente botón para validar tu cuenta:
                    </p>
                    <a href="${url}" style="
                        display: inline-block;
                        background-color: #9333EA;
                        color: #fff;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    ">
                        Validar Cuenta
                    </a>
                    <p style="margin: 20px 0; font-size: 16px;">
                        O copia y pega este enlace en tu navegador:
                    </p>
                    <p style="background: #f4f4f4; padding: 10px; border-radius: 5px; font-family: monospace;">
                        ${url}
                    </p>
                    <p>Tu código de validación es: <strong>${token}</strong></p>
                    <p>Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
                    <p style="margin-top: 30px; font-size: 14px; color: #777;">
                        Saludos,<br>
                        El equipo de UpTask
                    </p>
                </div>
            `,
        });
    };

    static enviarEmailRecuperacionPassword = async ({ name, email, token }: IEmail) => {
        const url = `${process.env.FRONTEND_URL}/auth/new-password`;

        await transport.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: email,
            subject: 'UpTask - Recupera tu contraseña',
            text: 'Recupera tu contraseña en UpTask.',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #9333EA;">Recuperación de contraseña</h1>
                    <p>Hola, <strong>${name}</strong></p>
                    <p>Has solicitado restablecer tu contraseña en <strong>UpTask</strong>. Por favor, sigue las instrucciones para completar el proceso.</p>
                    <p style="margin: 20px 0; font-size: 16px;">
                        Haz clic en el siguiente botón para ingresar el código de validación y restablecer tu contraseña:
                    </p>
                    <a href="${url}" style="
                        display: inline-block;
                        background-color: #9333EA;
                        color: #fff;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    ">
                        Restablecer Contraseña
                    </a>
                    <p style="margin: 20px 0; font-size: 16px;">
                        O copia y pega este enlace en tu navegador:
                    </p>
                    <p style="background: #f4f4f4; padding: 10px; border-radius: 5px; font-family: monospace;">
                        ${url}
                    </p>
                    <p>Tu código de validación es: <strong>${token}</strong></p>
                    <p>Este código es válido por un tiempo limitado. Si no solicitaste este cambio, puedes ignorar este correo.</p>
                    <p style="margin-top: 30px; font-size: 14px; color: #777;">
                        Saludos,<br>
                        El equipo de UpTask
                    </p>
                </div>
            `,
        });
    };
}
