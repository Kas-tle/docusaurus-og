import { Button, Typography } from '@acid-info/lsd-react'
import Link from '@docusaurus/Link'
import React from 'react'
import { IconAvatar, IconDiscordWhite, IconGithub } from '../../Icon'
import './ProfileCard.scss'
import clsx from 'clsx'

export type ProfileCardProps = React.HTMLProps<HTMLDivElement> & {
  imgSrc?: string
  name?: string
  githubUsername?: string
  githubLink?: string
  discordUsername?: string
  discordLink?: string
}

/**
 * A component used to display team members' profiles, including their name, avatar, and social links.
 *
 * @example
 * ```tsx
 * import { ProfileCard } from '@acid-info/logos-docusaurus-theme/lib/client/components/mdx';
 *
 * <ProfileCard
 *   imgSrc="/path/to/profile-image.jpg"
 *   name="John Doe"
 *   githubUsername="johndoe"
 *   githubLink="https://github.com/johndoe"
 *   discordUsername="johndoe#1234"
 *   discordLink="https://discordapp.com/users/johndoe"
 * />
 * ```
 *
 * Example usage of ProfileCard within a grid:
 *
 * ```tsx
 * import { Grid, ProfileCard } from '@acid-info/logos-docusaurus-theme/lib/client/components/mdx';
 *
 * <Grid
 *   xs={{ cols: 3, gap: '1rem', wrap: false }}
 *   md={{ cols: 4, gap: '1rem', wrap: true }}
 * >
 *   <Grid.Item>
 *     <ProfileCard
 *       name="Name"
 *       githubUsername="Github"
 *       githubLink="https://github.com/"
 *       discordUsername="Discord"
 *       discordLink="https://discord.gg/"
 *     />
 *   </Grid.Item>
 *   Add more ProfileCard items within the grid
 * </Grid>
 * ```
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  imgSrc,
  name,
  githubUsername,
  githubLink,
  discordUsername,
  discordLink,
  ...props
}) => {
  return (
    <div {...props} className={clsx('mdx-profile-card', props.className)}>
      <div className="mdx-profile-card__profile">
        {typeof imgSrc === 'undefined' && name ? (
          <span className="mdx-profile-card__profile-placeholder">
            {name[0]?.toUpperCase()}
          </span>
        ) : (
          <img
            alt={typeof name === 'string' ? name : ''}
            className="mdx-profile-card__profile-image"
            src={imgSrc}
          />
        )}
        <div>
          <Typography
            className="mdx-profile-card__name"
            variant="h4"
            component="h4"
          >
            {name}
          </Typography>
          {githubUsername || discordUsername ? (
            <div className="mdx-profile-card__buttons">
              {githubUsername && githubLink && (
                <Link
                  href={githubLink}
                  target="_blank"
                  className={'mdx-profile-card__link'}
                >
                  <IconGithub />
                </Link>
              )}
              {discordUsername && discordLink && (
                <Link
                  href={discordLink}
                  target="_blank"
                  className={'mdx-profile-card__link'}
                >
                  <IconDiscordWhite />
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
