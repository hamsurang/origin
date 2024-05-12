import { Avatar, AvatarFallback, AvatarImage } from '@ui/components'
import { 클라이머 } from './People.constants'

export const People = () => {
  return (
    <div className="mb-3 py-3 border-top">
      <a
        className="hover:underline"
        href="https://github.com/orgs/hamsurang/people"
        target="_blank"
        rel="noreferrer"
      >
        People
      </a>

      <div className="flex flex-wrap mt-3 gap-1">
        {클라이머.map(({ name, username }) => (
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" key={name}>
            <Avatar>
              <AvatarImage src={`https://github.com/${username}.png?size=70`} alt="" />
              <AvatarFallback />
            </Avatar>
          </a>
        ))}
      </div>
    </div>
  )
}
