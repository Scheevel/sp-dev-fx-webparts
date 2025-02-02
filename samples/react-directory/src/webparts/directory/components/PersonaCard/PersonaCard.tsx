import * as React from 'react';
import styles from './PersonaCard.module.scss';
import { IPersonaCardProps } from './IPersonaCardProps';
import { IPersonaCardState } from './IPersonaCardState';
import { Version, Environment, EnvironmentType, ServiceScope, Log, Text } from "@microsoft/sp-core-library";
import { SPComponentLoader } from "@microsoft/sp-loader";

import {
  Persona,
  PersonaCoin,
  PersonaInitialsColor,
  PersonaSize,
  IPersonaStyles,
  Label,
  DocumentCard,
  IDocumentCardStyles,
  DocumentCardType,
  Icon
}
  from 'office-ui-fabric-react';

const EXP_SOURCE: string = "SPFxDirectory";
const LIVE_PERSONA_COMPONENT_ID: string = "914330ee-2df2-4f6e-a858-30c23a812408";
//const PROFILE_IMAGE_URL: string = 'https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email={0}&UA=0&size=HR96x96&sc=1564597822258';

export class PersonaCard extends React.Component<IPersonaCardProps, IPersonaCardState> {

  constructor(props: IPersonaCardProps) {
    super(props);
    this.state = { livePersonaCard: undefined, pictureUrl: undefined };
  }
  /**
   *
   *
   * @memberof PersonaCard
   */
  public async componentDidMount() {

    const sharedLibrary = await this.loadSPComponentById(LIVE_PERSONA_COMPONENT_ID);
    const livePersonaCard: any = sharedLibrary.LivePersonaCard;
    this.setState( {livePersonaCard: livePersonaCard });
  }


  /**
   *
   *
   * @param {IPersonaCardProps} prevProps
   * @param {IPersonaCardState} prevState
   * @memberof PersonaCard
   */
  public componentDidUpdate(prevProps: IPersonaCardProps, prevState: IPersonaCardState): void {

  }


  /**
   *
   *
   * @private
   * @returns
   * @memberof PersonaCard
   */
  private _LivePersonaCard() {

    return React.createElement(this.state.livePersonaCard, {
      className: '',
      clientScenario: "PeopleWebPart",
      disableHover: false,
      hostAppPersonaInfo: {
        PersonaType: "User"
      },
      serviceScope: this.props.context.serviceScope,
      upn: this.props.profileProperties.Email,
      onCardOpen: () => {
      },
      onCardClose: () => {
      }
    }, this._PersonaCard());
  }


  /**
   *
   *
   * @private
   * @returns {JSX.Element}
   * @memberof PersonaCard
   */
  private _PersonaCard(): JSX.Element {
    return (
      <DocumentCard className={styles.documentCard} type={DocumentCardType.normal} style={{maxWidth: 350}}>

        <div className={styles.persona}>
          <Persona
            text={this.props.profileProperties.DisplayName}
            secondaryText={this.props.profileProperties.Title}
            tertiaryText={this.props.profileProperties.Department}
            imageUrl={this.props.profileProperties.PictureUrl}
            size={PersonaSize.size72}
            imageShouldFadeIn={false}
            imageShouldStartVisible={true}>
            <Label>
              {
                this.props.profileProperties.WorkPhone ?
                  <div>
                    <Icon iconName='Phone'  style={{ fontSize: '12px' }}/>
                    <span style={{ marginLeft: 5, fontSize: '12px' }}> {this.props.profileProperties.WorkPhone}</span>
                  </div>
                  :
                  ''
              }

            </Label>
          </Persona>
        </div>


      </DocumentCard>

    );
  }
  /**
      * Load SPFx component by id, SPComponentLoader is used to load the SPFx components
      * @param componentId - componentId, guid of the component library
      */
  private async loadSPComponentById(componentId: string): Promise<any> {
    try {
      const component: any = await SPComponentLoader.loadComponentById(componentId);
      return component;

    } catch (error) {
      Promise.reject(error);
      Log.error(EXP_SOURCE, error, this.props.context.serviceScope);
    }
  }


  /**
   *
   *
   * @returns {React.ReactElement<IPersonaCardProps>}
   * @memberof PersonaCard
   */
  public render(): React.ReactElement<IPersonaCardProps> {

    return (
      <div className={styles.personaContainer}>
        {
          this.state.livePersonaCard ?
            this._LivePersonaCard()
            :
            this._PersonaCard()
        }
      </div>
    );
  }
}
