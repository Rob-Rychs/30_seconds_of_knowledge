import React, {Component} from 'react';
import {hot} from 'react-hot-loader';

import MarkdownRenderer from '../../components/markdown-renderer';
import Header from '../../components/header';
import Spinner from '../../components/spinner';
import Chip from '../../components/chip';
import Footer from '../../components/footer';
import ControllsOverlay from '../../components/controlls-overlay';

import {restoreFromStorage, restoreSnippetsFromStorage} from '../../api/storage';
import {THEMES_VARIANTS} from '../../lib/consts';
import {fetchSnippet} from '../../api/snippets';

import './ViewTab.css';

const CLASS = 'sok-ViewTab';

class ViewTab extends Component {
	constructor(props) {
		super(props);

		this.state = {
			snippet: null,
			language: null,
			theme: THEMES_VARIANTS.dark,
		};
	}

	componentDidMount() {
		this.setColorScheme();
		this.fetchSnippet();
	}

	fetchSnippet = async () => {
		const index = location.hash.split('#')[1];
		if (!index) {
			return null;
		}

		let snippets = await restoreSnippetsFromStorage();

		const {src, language} = snippets[index];

		const snippetData = await fetchSnippet(src, language);
		const {snippet} = snippetData;

		this.setState({
			snippet,
			language,
		});
	};

	setColorScheme = async () => {
		const options = await restoreFromStorage();
		const {theme} = options;

		if (theme === THEMES_VARIANTS.light) {
			require('../../../css/themes/light.css');
		} else {
			require('../../../css/themes/dark.css');
		}

		this.setState({
			theme,
		});
	};

	renderSnippet = () => {
		const {snippet, language} = this.state;

		if (!snippet) {
			return null;
		}

		return <MarkdownRenderer lang={language} source={snippet} />;
	};

	renderSpinner = () => {
		const {snippet} = this.state;

		if (snippet) {
			return null;
		}

		return <Spinner />;
	};

	renderLangChip = () => {
		const {language} = this.state;

		if (!language) {
			return null;
		}

		return <Chip value={language} />;
	};

	render() {
		const {theme} = this.state;
		return (
			<div className={CLASS}>
				<ControllsOverlay renderBack={true} />
				{this.renderSpinner()}
				<Header theme={theme} />
				<span className={`${CLASS}-contentContainer`}>
					<span className={`${CLASS}-contentHeader`}>{this.renderLangChip()}</span>
					{this.renderSnippet()}
				</span>
				<Footer />
			</div>
		);
	}
}

export default hot(module)(ViewTab);
