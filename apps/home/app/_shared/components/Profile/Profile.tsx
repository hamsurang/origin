import { Email } from '@hamsurang/icon'
import { Avatar, AvatarFallback, AvatarImage } from '@hamsurang/ui'

type ProfileProps = {
  name: string
  username: string
  email: string
  description?: string
}

export const Profile = ({ name, username, description, email }: ProfileProps) => {
  return (
    <div>
      <div className="flex flex-col mobile:flex-row mobile:items-center mobile:gap-4 mobile:pb-4">
        <Avatar className="w-[296px] h-[296px] mobile:size-[16%] mobile:aspect-square">
          <AvatarImage
            src={`https://github.com/${username}.png?size=296`}
            alt={`${username}의 프로필`}
          />
          <AvatarFallback />
        </Avatar>

        <div className="flex flex-col py-4 mobile:flex-grow mobile:py-0">
          <span className="text-3xl font-semibold mobile:text-lg">{name}</span>
          <span className="text-gray-500">{username}</span>
          {description && <p>{description}</p>}
        </div>
      </div>

      <div className="flex gap-4 text-gray-500 mobile:flex-col mobile:gap-2 mobile:text-sm">
        <span className="flex items-center gap-1">
          <Email />
          <a className="hover:underline" href={`mailto:${email}`}>
            {email}
          </a>
        </span>
      </div>
    </div>
  )
}
